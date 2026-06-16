import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, required: true, lowercase: true, trim: true },
    description: { type: String, default: "" },
    shortDescription: { type: String, default: "" },
    images: { type: [String], default: [] },
    featuredImage: { type: String, required: true },
    badge: { type: String, default: "" },
    badgeColor: { type: String, default: "brand-blue" },
    specs: {
      type: Map,
      of: String,
      default: {},
    },
    status: { type: String, enum: ["draft", "published", "archived", "active"], default: "draft" },
    featured: { type: Boolean, default: false },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    
    // Dynamic System Extended Fields
    galleryImages: { type: [String], default: [] },
    highlights: { type: [String], default: [] },
    fullDescription: { type: String, default: "" },
    specifications: {
      type: Map,
      of: String,
      default: {},
    },
    displayOrder: { type: Number, default: 0 },
    publishedAt: { type: Date },
    
    // Product PDF Downloads
    brochureUrl: { type: String, default: "" },
    techSpecsUrl: { type: String, default: "" },
    installGuideUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
