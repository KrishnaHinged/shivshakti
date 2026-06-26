import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      default: "System Administrator",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [
        "SUPER_ADMIN",
        "SALES_MANAGER",
        "SALES_EXECUTIVE",
        "CONTENT_EDITOR",
        "MARKETING_MANAGER",
      ],
      default: "SALES_EXECUTIVE",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    permissions: {
      type: [String],
      default: [],
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    otpCode: {
      type: String,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null,
    },
    resetToken: {
      type: String,
      default: null,
    },
    resetTokenExpiry: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
