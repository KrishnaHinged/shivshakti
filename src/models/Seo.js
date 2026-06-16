import mongoose from "mongoose";

const SeoSchema = new mongoose.Schema(
  {
    pagePath: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    metaTitle: { type: String, required: true, trim: true },
    metaDescription: { type: String, required: true },
    openGraphImage: { type: String, default: "" },
    schemaMarkup: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Seo || mongoose.model("Seo", SeoSchema);
