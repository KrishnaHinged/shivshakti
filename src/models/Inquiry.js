import mongoose from "mongoose";

const InquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    company: { type: String, default: "", trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    city: { type: String, default: "", trim: true },
    productInterest: { type: String, default: "", trim: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: [
        "new",
        "contacted",
        "quotation_sent",
        "converted",
        "closed",
        "rejected",
        "New",
        "Contacted",
        "Qualified",
        "Closed",
        "Rejected",
      ],
      default: "New",
    },
    notes: {
      type: [
        {
          text: { type: String, required: true },
          adminName: { type: String, required: true },
          createdAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
    elevatorType: { type: String, default: "" },
    componentNeeded: { type: String, default: "" },
    quantity: { type: String, default: "" },
    productId: { type: String, default: "" },
    productSlug: { type: String, default: "" },
    productTitle: { type: String, default: "" },
    customizationColor: { type: String, default: "" },
    customizationFinish: { type: String, default: "" },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    assignedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Inquiry || mongoose.model("Inquiry", InquirySchema);
