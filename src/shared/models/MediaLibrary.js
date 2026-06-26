import mongoose from "mongoose";

const MediaLibrarySchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    url: { type: String, required: true },
    publicId: { type: String, required: true, unique: true },
    fileType: { type: String, required: true }, // e.g., 'image' or 'pdf'
    fileSize: { type: Number, default: 0 },
    folder: { type: String, default: "shivshakti" },
  },
  { timestamps: true }
);

export default mongoose.models.MediaLibrary ||
  mongoose.model("MediaLibrary", MediaLibrarySchema);
