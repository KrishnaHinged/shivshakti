import mongoose from "mongoose";

const ActivityLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    details: { type: String, default: "" },
    ipAddress: { type: String, default: "" },
    userAgent: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.ActivityLog ||
  mongoose.model("ActivityLog", ActivityLogSchema);
