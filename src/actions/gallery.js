"use server";

import dbConnect from "@/lib/mongodb";
import Gallery from "@/models/Gallery";
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
 * Create a new gallery item
 */
export async function createGalleryAction(formData) {
  try {
    await verifyAuth();
    await dbConnect();

    const title = formData.get("title")?.toString().trim();
    const image = formData.get("image")?.toString().trim();
    const category = formData.get("category")?.toString().trim().toLowerCase();
    const featured = formData.get("featured") === "true";
    const sortOrder = parseInt(formData.get("sortOrder")?.toString() || "0", 10);

    if (!title || !image || !category) {
      return { success: false, error: "Missing required fields." };
    }

    const item = await Gallery.create({
      title,
      image,
      category,
      featured,
      sortOrder,
    });

    await ActivityLog.create({
      action: "gallery_create",
      details: `Added gallery image: ${title}`,
    });

    revalidatePath("/");
    revalidatePath("/admin/gallery");
    return { success: true, data: JSON.parse(JSON.stringify(item)) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Edit a gallery item
 */
export async function editGalleryAction(id, formData) {
  try {
    await verifyAuth();
    await dbConnect();

    const title = formData.get("title")?.toString().trim();
    const image = formData.get("image")?.toString().trim();
    const category = formData.get("category")?.toString().trim().toLowerCase();
    const featured = formData.get("featured") === "true";
    const sortOrder = parseInt(formData.get("sortOrder")?.toString() || "0", 10);

    if (!title || !image || !category) {
      return { success: false, error: "Missing required fields." };
    }

    const item = await Gallery.findByIdAndUpdate(
      id,
      {
        title,
        image,
        category,
        featured,
        sortOrder,
      },
      { new: true }
    );

    if (!item) return { success: false, error: "Gallery item not found." };

    await ActivityLog.create({
      action: "gallery_edit",
      details: `Edited gallery image: ${title}`,
    });

    revalidatePath("/");
    revalidatePath("/admin/gallery");
    return { success: true, data: JSON.parse(JSON.stringify(item)) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Delete a gallery item
 */
export async function deleteGalleryAction(id) {
  try {
    await verifyAuth();
    await dbConnect();

    const item = await Gallery.findByIdAndDelete(id);
    if (!item) return { success: false, error: "Gallery item not found." };

    await ActivityLog.create({
      action: "gallery_delete",
      details: `Deleted gallery image: ${item.title}`,
    });

    revalidatePath("/");
    revalidatePath("/admin/gallery");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
