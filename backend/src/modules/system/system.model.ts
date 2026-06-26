import mongoose, { Document, Schema } from 'mongoose';

export interface ISystemSettings extends Document {
  _id: string;
  maintenanceMode: boolean;
  maintenanceTitle: string;
  maintenanceMessage: string;
  estimatedEndTime: Date | null;
  showCountdown: boolean;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const systemSettingsSchema = new Schema<ISystemSettings>(
  {
    _id: {
      type: String,
      default: 'system_settings',
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    maintenanceTitle: {
      type: String,
      default: 'Scheduled Maintenance',
      trim: true,
    },
    maintenanceMessage: {
      type: String,
      default: 'We are currently upgrading our systems. Please check back shortly.',
      trim: true,
    },
    estimatedEndTime: {
      type: Date,
      default: null,
    },
    showCountdown: {
      type: Boolean,
      default: false,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    _id: false, // Tell Mongoose we are defining _id manually
  },
);

export const SystemSettings = mongoose.model<ISystemSettings>('SystemSettings', systemSettingsSchema);
