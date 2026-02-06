import { Request, Response } from 'express';
import { Subscriber } from './subscriber.model';
import * as ExcelJS from 'exceljs';
import * as path from 'path';

export const subscribe = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Check if email already exists
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({ success: false, message: 'Email already subscribed' });
    }

    const subscriber = new Subscriber({ email });
    await subscriber.save();

    return res.status(201).json({
      success: true,
      message: 'Thank you for subscribing!',
      data: subscriber,
    });
  } catch (error: any) {
    console.error('Subscription error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process subscription',
      error: error?.message,
    });
  }
};

export const getAllSubscribers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [subscribers, total] = await Promise.all([
      Subscriber.find().sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Subscriber.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      data: subscribers,
      pagination: {
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error('Error fetching subscribers:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch subscribers',
      error: error?.message,
    });
  }
};

export const deleteSubscriber = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const subscriber = await Subscriber.findByIdAndDelete(id);

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Subscriber deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting subscriber:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete subscriber',
      error: error?.message,
    });
  }
};

export const exportSubscribers = async (req: Request, res: Response) => {
  try {
    const { format = 'excel' } = req.query;
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });

    if (format === 'excel') {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Subscribers');

      // Add headers
      worksheet.columns = [
        { header: 'Email', key: 'email', width: 40 },
        { header: 'Subscribed On', key: 'createdAt', width: 30 },
      ];

      // Add data
      subscribers.forEach((subscriber) => {
        worksheet.addRow({
          email: subscriber.email,
          createdAt: subscriber.createdAt.toLocaleString(),
        });
      });

      // Set response headers
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader('Content-Disposition', 'attachment; filename=subscribers.xlsx');

      // Send the file
      await workbook.xlsx.write(res);
      res.end();
    } else if (format === 'csv') {
      // Build CSV manually (csv-writer doesn't support stringify to string)
      const header = ['Email', 'Subscribed On'];
      const rows = subscribers.map((s) => [s.email, s.createdAt.toLocaleString()]);

      // Escape CSV fields: wrap in quotes and escape quotes
      const escape = (val: string) => `"${String(val).replace(/"/g, '""')}"`;
      const csv = [header.map(escape).join(','), ...rows.map((r) => r.map(escape).join(','))].join(
        '\n',
      );

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=subscribers.csv');
      res.send(csv);
    } else {
      // Default to JSON if format is not specified or invalid
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=subscribers.json');
      res.send(JSON.stringify(subscribers, null, 2));
    }
  } catch (error: any) {
    console.error('Error exporting subscribers:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to export subscribers',
      error: error?.message,
    });
  }
};
