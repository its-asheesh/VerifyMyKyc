"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportSubscribers = exports.deleteSubscriber = exports.getAllSubscribers = exports.subscribe = void 0;
const subscriber_model_1 = require("./subscriber.model");
const ExcelJS = __importStar(require("exceljs"));
const subscribe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }
        // Check if email already exists
        const existingSubscriber = yield subscriber_model_1.Subscriber.findOne({ email });
        if (existingSubscriber) {
            return res.status(400).json({ success: false, message: 'Email already subscribed' });
        }
        const subscriber = new subscriber_model_1.Subscriber({ email });
        yield subscriber.save();
        return res.status(201).json({
            success: true,
            message: 'Thank you for subscribing!',
            data: subscriber
        });
    }
    catch (error) {
        console.error('Subscription error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to process subscription',
            error: error === null || error === void 0 ? void 0 : error.message
        });
    }
});
exports.subscribe = subscribe;
const getAllSubscribers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const [subscribers, total] = yield Promise.all([
            subscriber_model_1.Subscriber.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            subscriber_model_1.Subscriber.countDocuments()
        ]);
        return res.status(200).json({
            success: true,
            data: subscribers,
            pagination: {
                total,
                page: Number(page),
                totalPages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        console.error('Error fetching subscribers:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch subscribers',
            error: error === null || error === void 0 ? void 0 : error.message
        });
    }
});
exports.getAllSubscribers = getAllSubscribers;
const deleteSubscriber = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const subscriber = yield subscriber_model_1.Subscriber.findByIdAndDelete(id);
        if (!subscriber) {
            return res.status(404).json({
                success: false,
                message: 'Subscriber not found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Subscriber deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting subscriber:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete subscriber',
            error: error === null || error === void 0 ? void 0 : error.message
        });
    }
});
exports.deleteSubscriber = deleteSubscriber;
const exportSubscribers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { format = 'excel' } = req.query;
        const subscribers = yield subscriber_model_1.Subscriber.find().sort({ createdAt: -1 });
        if (format === 'excel') {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Subscribers');
            // Add headers
            worksheet.columns = [
                { header: 'Email', key: 'email', width: 40 },
                { header: 'Subscribed On', key: 'createdAt', width: 30 }
            ];
            // Add data
            subscribers.forEach(subscriber => {
                worksheet.addRow({
                    email: subscriber.email,
                    createdAt: subscriber.createdAt.toLocaleString()
                });
            });
            // Set response headers
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=subscribers.xlsx');
            // Send the file
            yield workbook.xlsx.write(res);
            res.end();
        }
        else if (format === 'csv') {
            // Build CSV manually (csv-writer doesn't support stringify to string)
            const header = ['Email', 'Subscribed On'];
            const rows = subscribers.map(s => [
                s.email,
                s.createdAt.toLocaleString()
            ]);
            // Escape CSV fields: wrap in quotes and escape quotes
            const escape = (val) => `"${String(val).replace(/"/g, '""')}"`;
            const csv = [
                header.map(escape).join(','),
                ...rows.map(r => r.map(escape).join(','))
            ].join('\n');
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=subscribers.csv');
            res.send(csv);
        }
        else {
            // Default to JSON if format is not specified or invalid
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', 'attachment; filename=subscribers.json');
            res.send(JSON.stringify(subscribers, null, 2));
        }
    }
    catch (error) {
        console.error('Error exporting subscribers:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to export subscribers',
            error: error === null || error === void 0 ? void 0 : error.message
        });
    }
});
exports.exportSubscribers = exportSubscribers;
