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
    // Redesign Catalog Fields
    productType: { type: String, enum: ["our-product", "dealer-product", "elevator-kit"], default: "our-product" },
    brand: { type: String, default: "" },
    subCategory: { type: String, default: "" },
    inquiryEnabled: { type: Boolean, default: true },

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

    // 360° Interior Cabin View
    has360View: { type: Boolean, default: false },
    view360: {
      front: { type: String, default: "" },
      back: { type: String, default: "" },
      left: { type: String, default: "" },
      right: { type: String, default: "" },
      ceiling: { type: String, default: "" },
      floor: { type: String, default: "" },
    },

    // Layout Cabin Customization Fields
    availableColors: {
      type: [{
        name: { type: String, required: true },
        code: { type: String, required: true },
        enabled: { type: Boolean, default: true }
      }],
      default: []
    },
    availableFinishes: {
      type: [{
        name: { type: String, required: true },
        code: { type: String, required: true },
        enabled: { type: Boolean, default: true }
      }],
      default: []
    },
    defaultColor: { type: String, default: "" },
    defaultFinish: { type: String, default: "" },
    customizationVariants: {
      type: [{
        color: { type: String, required: true },
        finish: { type: String, required: true },
        image: { type: String, default: "" },
        enabled: { type: Boolean, default: true }
      }],
      default: []
    },
    // 360° View Variants — per color+finish combination
    view360Variants: {
      type: [{
        color: { type: String, required: true },
        finish: { type: String, required: true },
        view360: {
          front: { type: String, default: "" },
          back: { type: String, default: "" },
          left: { type: String, default: "" },
          right: { type: String, default: "" },
          ceiling: { type: String, default: "" },
          floor: { type: String, default: "" },
        },
        enabled: { type: Boolean, default: true }
      }],
      default: []
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
