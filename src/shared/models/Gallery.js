import mongoose from "mongoose";

const GallerySchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: [
        "factory",
        "cabins",
        "doors",
        "projects",
        "installations",
        "wire_rope",
        "events",
      ],
      lowercase: true,
      trim: true,
    },
    featured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Gallery || mongoose.model("Gallery", GallerySchema);
