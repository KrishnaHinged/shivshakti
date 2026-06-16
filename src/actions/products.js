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
    
    // Parse PDF download links
    const brochureUrl = formData.get("brochureUrl")?.toString().trim() || "";
    const techSpecsUrl = formData.get("techSpecsUrl")?.toString().trim() || "";
    const installGuideUrl = formData.get("installGuideUrl")?.toString().trim() || "";

    const highlights = highlightsStr ? highlightsStr.split("\n").map(h => h.trim()).filter(Boolean) : [];

    // Parse specs JSON
    const specsStr = formData.get("specs")?.toString() || "{}";
    let specs = {};
    try {
      specs = JSON.parse(specsStr);
    } catch (e) {
      return { success: false, error: "Invalid specifications JSON formatting." };
    }

    if (!title || !slug || !category || !shortDescription || !description || !featuredImage) {
      return { success: false, error: "Missing required fields." };
    }

    const exists = await Product.findOne({ slug });
    if (exists) {
      return { success: false, error: "Product with this slug already exists." };
    }

    const images = imagesStr ? imagesStr.split(",").map(i => i.trim()).filter(Boolean) : [];
    const publishedAt = status === "published" ? new Date() : null;

    const product = await Product.create({
      title,
      slug,
      category,
      shortDescription,
      description,
      fullDescription: description,
      featuredImage,
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
      installGuideUrl
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
    
    // Parse PDF download links
    const brochureUrl = formData.get("brochureUrl")?.toString().trim() || "";
    const techSpecsUrl = formData.get("techSpecsUrl")?.toString().trim() || "";
    const installGuideUrl = formData.get("installGuideUrl")?.toString().trim() || "";

    const highlights = highlightsStr ? highlightsStr.split("\n").map(h => h.trim()).filter(Boolean) : [];

    // Parse specs JSON
    const specsStr = formData.get("specs")?.toString() || "{}";
    let specs = {};
    try {
      specs = JSON.parse(specsStr);
    } catch (e) {
      return { success: false, error: "Invalid specifications JSON formatting." };
    }

    if (!title || !slug || !category || !shortDescription || !description || !featuredImage) {
      return { success: false, error: "Missing required fields." };
    }

    // Check slug uniqueness
    const exists = await Product.findOne({ slug, _id: { $ne: productId } });
    if (exists) {
      return { success: false, error: "Another product with this slug already exists." };
    }

    const images = imagesStr ? imagesStr.split(",").map(i => i.trim()).filter(Boolean) : [];

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
        category,
        shortDescription,
        description,
        fullDescription: description,
        featuredImage,
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
        installGuideUrl
      },
      { new: true }
    );

    await ActivityLog.create({
      action: "product_edit",
      details: `Edited product: ${title} (${slug})`,
    });

    revalidatePath("/");
    revalidatePath("/admin/products");
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

    const duplicate = await Product.create({
      title,
      slug,
      category: original.category,
      shortDescription: original.shortDescription,
      description: original.description,
      featuredImage: original.featuredImage,
      images: original.images,
      badge: original.badge,
      badgeColor: original.badgeColor,
      specs: original.specs,
      status: "active",
      featured: false,
      seoTitle: original.seoTitle,
      seoDescription: original.seoDescription,
    });

    await ActivityLog.create({
      action: "product_duplicate",
      details: `Duplicated product ${original.title} as ${title}`,
    });

    revalidatePath("/");
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
    const product = await Product.findByIdAndUpdate(productId, { status }, { new: true });
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
