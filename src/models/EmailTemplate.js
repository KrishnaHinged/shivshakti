import mongoose from "mongoose";

const EmailTemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
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
    variables: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.models.EmailTemplate || mongoose.model("EmailTemplate", EmailTemplateSchema);
