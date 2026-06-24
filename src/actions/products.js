"use server";

import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import ActivityLog from "@/models/ActivityLog";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

/**
 * Verify if admin is logged in
 */
async function verifyAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;
  if (!token) throw new Error("Unauthorized action execution.");
}

/**
 * Create a new product
 */
export async function createProductAction(formData) {
  try {
    await verifyAuth();
    await dbConnect();

    const title = formData.get("title")?.toString().trim();
    const slug = formData.get("slug")?.toString().trim().toLowerCase();
    const category = formData.get("category")?.toString().trim().toLowerCase();
    const shortDescription = formData.get("shortDescription")?.toString().trim();
    const description = formData.get("description")?.toString().trim(); // represents fullDescription
    const featuredImage = formData.get("featuredImage")?.toString().trim();
    const imagesStr = formData.get("images")?.toString().trim() || "";
    const badge = formData.get("badge")?.toString().trim();
    const badgeColor = formData.get("badgeColor")?.toString().trim() || "brand-blue";
    const status = formData.get("status")?.toString() || "draft";
    const featured = formData.get("featured") === "true";
    const seoTitle = formData.get("seoTitle")?.toString().trim();
    const seoDescription = formData.get("seoDescription")?.toString().trim();
    const displayOrder = Number(formData.get("displayOrder")) || 0;
    const highlightsStr = formData.get("highlights")?.toString().trim() || "";
    
    // Redesign Fields
    const productType = formData.get("productType")?.toString().trim() || "our-product";
    const brand = formData.get("brand")?.toString().trim() || "";
    const subCategory = formData.get("subCategory")?.toString().trim() || "";
    const inquiryEnabled = formData.get("inquiryEnabled") !== "false"; // default true

    // Parse PDF download links
    const brochureUrl = formData.get("brochureUrl")?.toString().trim() || "";
    const techSpecsUrl = formData.get("techSpecsUrl")?.toString().trim() || "";
    const installGuideUrl = formData.get("installGuideUrl")?.toString().trim() || "";

    // Parse 360° view fields
    const has360View = formData.get("has360View") === "true";
    const view360Str = formData.get("view360")?.toString() || "{}";
    let view360 = { front: "", back: "", left: "", right: "", ceiling: "", floor: "" };
    try {
      view360 = { ...view360, ...JSON.parse(view360Str) };
    } catch (e) {
      // Keep defaults
    }

    // Parse customization configuration fields
    const availableColorsStr = formData.get("availableColors")?.toString() || "[]";
    const availableFinishesStr = formData.get("availableFinishes")?.toString() || "[]";
    const customizationVariantsStr = formData.get("customizationVariants")?.toString() || "[]";
    const view360VariantsStr = formData.get("view360Variants")?.toString() || "[]";
    const defaultColor = formData.get("defaultColor")?.toString() || "";
    const defaultFinish = formData.get("defaultFinish")?.toString() || "";

    let availableColors = [];
    let availableFinishes = [];
    let customizationVariants = [];
    let view360Variants = [];

    try { availableColors = JSON.parse(availableColorsStr); } catch (e) { console.error("Parse availableColors failed:", e.message); }
    try { availableFinishes = JSON.parse(availableFinishesStr); } catch (e) { console.error("Parse availableFinishes failed:", e.message); }
    try { customizationVariants = JSON.parse(customizationVariantsStr); } catch (e) { console.error("Parse customizationVariants failed:", e.message); }
    try { view360Variants = JSON.parse(view360VariantsStr); } catch (e) { console.error("Parse view360Variants failed:", e.message); }

    const highlights = highlightsStr ? highlightsStr.split("\n").map(h => h.trim()).filter(Boolean) : [];

    // Parse specs JSON
    const specsStr = formData.get("specs")?.toString() || "{}";
    let specs = {};
    try {
      specs = JSON.parse(specsStr);
    } catch (e) {
      return { success: false, error: "Invalid specifications JSON formatting." };
    }

    // Validation depends on productType
    if (productType === "elevator-kit") {
      if (!title || !slug || !shortDescription || !imagesStr) {
        return { success: false, error: "Missing required fields for elevator kit: Product Name, Gallery Images, and Short Description." };
      }
    } else {
      if (!title || !slug || !category || !shortDescription || !description || !featuredImage) {
        return { success: false, error: "Missing required fields." };
      }
    }

    // Validate 360° view: all 6 images required when enabled
    if (has360View) {
      const view360Fields = ["front", "back", "left", "right", "ceiling", "floor"];
      const missing = view360Fields.filter((f) => !view360[f]);
      if (missing.length > 0) {
        return { success: false, error: `360° View is enabled but missing images: ${missing.join(", ")}. Please upload all 6 images or disable the 360° toggle.` };
      }
    }

    const exists = await Product.findOne({ slug });
    if (exists) {
      return { success: false, error: "Product with this slug already exists." };
    }

    const images = imagesStr ? imagesStr.split(",").map(i => i.trim()).filter(Boolean) : [];
    const firstImage = images[0] || "";
    const finalFeaturedImage = productType === "elevator-kit" ? (featuredImage || firstImage) : featuredImage;
    const finalCategory = productType === "elevator-kit" ? "elevator-kit" : category;
    const finalDescription = productType === "elevator-kit" ? (description || shortDescription) : description;

    const publishedAt = status === "published" ? new Date() : null;

    const product = await Product.create({
      title,
      slug,
      category: finalCategory,
      shortDescription,
      description: finalDescription,
      fullDescription: finalDescription,
      featuredImage: finalFeaturedImage,
      images,
      galleryImages: images,
      badge,
      badgeColor,
      specs,
      specifications: specs,
      status,
      featured,
      seoTitle,
      seoDescription,
      highlights,
      displayOrder,
      publishedAt,
      brochureUrl,
      techSpecsUrl,
      installGuideUrl,
      has360View,
      view360,
      productType,
      brand,
      subCategory,
      inquiryEnabled,
      availableColors,
      availableFinishes,
      defaultColor,
      defaultFinish,
      customizationVariants,
      view360Variants
    });

    await ActivityLog.create({
      action: "product_create",
      details: `Created product: ${title} (${slug})`,
    });

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin/products");
    return { success: true, data: JSON.parse(JSON.stringify(product)) };
  } catch (error) {
    console.error("Create product action error:", error);
    return { success: false, error: error.message || "Failed to create product." };
  }
}

/**
 * Edit an existing product
 */
export async function editProductAction(productId, formData) {
  try {
    await verifyAuth();
    await dbConnect();

    const title = formData.get("title")?.toString().trim();
    const slug = formData.get("slug")?.toString().trim().toLowerCase();
    const category = formData.get("category")?.toString().trim().toLowerCase();
    const shortDescription = formData.get("shortDescription")?.toString().trim();
    const description = formData.get("description")?.toString().trim(); // represents fullDescription
    const featuredImage = formData.get("featuredImage")?.toString().trim();
    const imagesStr = formData.get("images")?.toString().trim() || "";
    const badge = formData.get("badge")?.toString().trim();
    const badgeColor = formData.get("badgeColor")?.toString().trim() || "brand-blue";
    const status = formData.get("status")?.toString() || "draft";
    const featured = formData.get("featured") === "true";
    const seoTitle = formData.get("seoTitle")?.toString().trim();
    const seoDescription = formData.get("seoDescription")?.toString().trim();
    const displayOrder = Number(formData.get("displayOrder")) || 0;
    const highlightsStr = formData.get("highlights")?.toString().trim() || "";
    
    // Redesign Fields
    const productType = formData.get("productType")?.toString().trim() || "our-product";
    const brand = formData.get("brand")?.toString().trim() || "";
    const subCategory = formData.get("subCategory")?.toString().trim() || "";
    const inquiryEnabled = formData.get("inquiryEnabled") !== "false"; // default true

    // Parse PDF download links
    const brochureUrl = formData.get("brochureUrl")?.toString().trim() || "";
    const techSpecsUrl = formData.get("techSpecsUrl")?.toString().trim() || "";
    const installGuideUrl = formData.get("installGuideUrl")?.toString().trim() || "";

    // Parse 360° view fields
    const has360View = formData.get("has360View") === "true";
    const view360Str = formData.get("view360")?.toString() || "{}";
    let view360 = { front: "", back: "", left: "", right: "", ceiling: "", floor: "" };
    try {
      view360 = { ...view360, ...JSON.parse(view360Str) };
    } catch (e) {
      // Keep defaults
    }

    // Parse customization configuration fields
    const availableColorsStr = formData.get("availableColors")?.toString() || "[]";
    const availableFinishesStr = formData.get("availableFinishes")?.toString() || "[]";
    const customizationVariantsStr = formData.get("customizationVariants")?.toString() || "[]";
    const view360VariantsStr = formData.get("view360Variants")?.toString() || "[]";
    const defaultColor = formData.get("defaultColor")?.toString() || "";
    const defaultFinish = formData.get("defaultFinish")?.toString() || "";

    let availableColors = [];
    let availableFinishes = [];
    let customizationVariants = [];
    let view360Variants = [];

    try { availableColors = JSON.parse(availableColorsStr); } catch (e) { console.error("Parse availableColors failed:", e.message); }
    try { availableFinishes = JSON.parse(availableFinishesStr); } catch (e) { console.error("Parse availableFinishes failed:", e.message); }
    try { customizationVariants = JSON.parse(customizationVariantsStr); } catch (e) { console.error("Parse customizationVariants failed:", e.message); }
    try { view360Variants = JSON.parse(view360VariantsStr); } catch (e) { console.error("Parse view360Variants failed:", e.message); }

    console.log("[editProductAction] customizationVariants count:", customizationVariants.length, "| view360Variants count:", view360Variants.length);

    const highlights = highlightsStr ? highlightsStr.split("\n").map(h => h.trim()).filter(Boolean) : [];

    // Parse specs JSON
    const specsStr = formData.get("specs")?.toString() || "{}";
    let specs = {};
    try {
      specs = JSON.parse(specsStr);
    } catch (e) {
      return { success: false, error: "Invalid specifications JSON formatting." };
    }

    // Validation depends on productType
    if (productType === "elevator-kit") {
      if (!title || !slug || !shortDescription || !imagesStr) {
        return { success: false, error: "Missing required fields for elevator kit: Product Name, Gallery Images, and Short Description." };
      }
    } else {
      if (!title || !slug || !category || !shortDescription || !description || !featuredImage) {
        return { success: false, error: "Missing required fields." };
      }
    }

    // Validate 360° view: all 6 images required when enabled
    if (has360View) {
      const view360Fields = ["front", "back", "left", "right", "ceiling", "floor"];
      const missing = view360Fields.filter((f) => !view360[f]);
      if (missing.length > 0) {
        return { success: false, error: `360° View is enabled but missing images: ${missing.join(", ")}. Please upload all 6 images or disable the 360° toggle.` };
      }
    }

    // Check slug uniqueness
    const exists = await Product.findOne({ slug, _id: { $ne: productId } });
    if (exists) {
      return { success: false, error: "Another product with this slug already exists." };
    }

    const images = imagesStr ? imagesStr.split(",").map(i => i.trim()).filter(Boolean) : [];
    const firstImage = images[0] || "";
    const finalFeaturedImage = productType === "elevator-kit" ? (featuredImage || firstImage) : featuredImage;
    const finalCategory = productType === "elevator-kit" ? "elevator-kit" : category;
    const finalDescription = productType === "elevator-kit" ? (description || shortDescription) : description;

    // Check if publishedAt needs to be set
    const existingProduct = await Product.findById(productId);
    let publishedAt = existingProduct?.publishedAt;
    if (status === "published" && !publishedAt) {
      publishedAt = new Date();
    }

    const product = await Product.findByIdAndUpdate(
      productId,
      {
        title,
        slug,
        category: finalCategory,
        shortDescription,
        description: finalDescription,
        fullDescription: finalDescription,
        featuredImage: finalFeaturedImage,
        images,
        galleryImages: images,
        badge,
        badgeColor,
        specs,
        specifications: specs,
        status,
        featured,
        seoTitle,
        seoDescription,
        highlights,
        displayOrder,
        publishedAt,
        brochureUrl,
        techSpecsUrl,
        installGuideUrl,
        has360View,
        view360,
        productType,
        brand,
        subCategory,
        inquiryEnabled,
        availableColors,
        availableFinishes,
        defaultColor,
        defaultFinish,
        customizationVariants,
        view360Variants
      },
      { returnDocument: 'after' }
    );

    await ActivityLog.create({
      action: "product_edit",
      details: `Edited product: ${title} (${slug})`,
    });

    revalidatePath("/");
    revalidatePath("/admin/products");
    revalidatePath(`/products/${slug}`);
    return { success: true, data: JSON.parse(JSON.stringify(product)) };
  } catch (error) {
    console.error("Edit product action error:", error);
    return { success: false, error: error.message || "Failed to update product." };
  }
}

/**
 * Delete a product
 */
export async function deleteProductAction(productId) {
  try {
    await verifyAuth();
    await dbConnect();

    const product = await Product.findByIdAndDelete(productId);
    if (!product) return { success: false, error: "Product not found." };

    await ActivityLog.create({
      action: "product_delete",
      details: `Deleted product: ${product.title}`,
    });

    revalidatePath("/");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || "Failed to delete product." };
  }
}

/**
 * Duplicate a product
 */
export async function duplicateProductAction(productId) {
  try {
    await verifyAuth();
    await dbConnect();

    const original = await Product.findById(productId);
    if (!original) return { success: false, error: "Product not found." };

    const title = `${original.title} (Copy)`;
    const slug = `${original.slug}-copy-${Date.now()}`;

    // Safely copy maps and arrays to avoid shared references
    const specsMap = original.specs ? (original.specs instanceof Map ? Object.fromEntries(original.specs) : original.specs) : {};
    const specificationsMap = original.specifications ? (original.specifications instanceof Map ? Object.fromEntries(original.specifications) : original.specifications) : {};
    const imagesArr = original.images ? [...original.images] : [];
    const galleryImagesArr = original.galleryImages ? [...original.galleryImages] : [];
    const highlightsArr = original.highlights ? [...original.highlights] : [];
    const view360Obj = original.view360 ? {
      front: original.view360.front || "",
      back: original.view360.back || "",
      left: original.view360.left || "",
      right: original.view360.right || "",
      ceiling: original.view360.ceiling || "",
      floor: original.view360.floor || "",
    } : { front: "", back: "", left: "", right: "", ceiling: "", floor: "" };

    const duplicate = await Product.create({
      title,
      slug,
      category: original.category,
      shortDescription: original.shortDescription,
      description: original.description,
      fullDescription: original.fullDescription || original.description || "",
      featuredImage: original.featuredImage,
      images: imagesArr,
      galleryImages: galleryImagesArr,
      badge: original.badge,
      badgeColor: original.badgeColor,
      specs: specsMap,
      specifications: specificationsMap,
      status: "draft", // Start duplicated product as draft
      featured: false,
      seoTitle: original.seoTitle,
      seoDescription: original.seoDescription,
      highlights: highlightsArr,
      displayOrder: original.displayOrder || 0,
      brochureUrl: original.brochureUrl || "",
      techSpecsUrl: original.techSpecsUrl || "",
      installGuideUrl: original.installGuideUrl || "",
      has360View: original.has360View || false,
      view360: view360Obj,
      productType: original.productType || "our-product",
      brand: original.brand || "",
      subCategory: original.subCategory || "",
      inquiryEnabled: original.inquiryEnabled !== false,
      availableColors: original.availableColors ? original.availableColors.map(c => ({ name: c.name, code: c.code, enabled: c.enabled })) : [],
      availableFinishes: original.availableFinishes ? original.availableFinishes.map(f => ({ name: f.name, code: f.code, enabled: f.enabled })) : [],
      defaultColor: original.defaultColor || "",
      defaultFinish: original.defaultFinish || "",
      customizationVariants: original.customizationVariants ? original.customizationVariants.map(v => ({ color: v.color, finish: v.finish, image: v.image, enabled: v.enabled })) : [],
      view360Variants: original.view360Variants ? original.view360Variants.map(v => ({
        color: v.color,
        finish: v.finish,
        view360: {
          front: v.view360?.front || "",
          back: v.view360?.back || "",
          left: v.view360?.left || "",
          right: v.view360?.right || "",
          ceiling: v.view360?.ceiling || "",
          floor: v.view360?.floor || "",
        },
        enabled: v.enabled
      })) : []
    });

    await ActivityLog.create({
      action: "product_duplicate",
      details: `Duplicated product ${original.title} as ${title}`,
    });

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin/products");
    return { success: true, data: JSON.parse(JSON.stringify(duplicate)) };
  } catch (error) {
    return { success: false, error: error.message || "Failed to duplicate product." };
  }
}

/**
 * Archive or activate a product
 */
export async function archiveProductAction(productId, archive = true) {
  try {
    await verifyAuth();
    await dbConnect();

    const status = archive ? "archived" : "active";
    const product = await Product.findByIdAndUpdate(productId, { status }, { returnDocument: 'after' });
    if (!product) return { success: false, error: "Product not found." };

    await ActivityLog.create({
      action: archive ? "product_archive" : "product_activate",
      details: `${archive ? "Archived" : "Activated"} product: ${product.title}`,
    });

    revalidatePath("/");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || "Failed to update status." };
  }
}
