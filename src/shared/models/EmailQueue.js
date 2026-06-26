import mongoose from "mongoose";

const EmailQueueSchema = new mongoose.Schema(
  {
    to: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
      required: true,
    },
    lastAttemptAt: {
      type: Date,
      default: null,
    },
    error: {
      type: String,
      default: null,
    },
    scheduledAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  { timestamps: true }
);

// Index to quickly query pending emails
EmailQueueSchema.index({ status: 1, scheduledAt: 1 });

export default mongoose.models.EmailQueue || mongoose.model("EmailQueue", EmailQueueSchema);
