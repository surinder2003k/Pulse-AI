import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  automationEnabled: boolean;
  automationCategory: string;
}

const SettingsSchema = new Schema(
  {
    automationEnabled: { type: Boolean, default: true },
    automationCategory: { type: String, default: "Global News" }
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);
