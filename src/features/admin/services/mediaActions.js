"use server";

import { dbConnect, deleteFromCloudinary } from "@/shared/lib";
import { MediaLibrary, ActivityLog } from "@/shared/models";
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
 * Delete a media asset from Cloudinary and MongoDB
 */
export async function deleteMediaAction(id) {
  try {
    await verifyAuth();
    await dbConnect();

    const mediaItem = await MediaLibrary.findById(id);
    if (!mediaItem) return { success: false, error: "Asset record not found." };

    // Delete from Cloudinary using stored public ID
    await deleteFromCloudinary(
      mediaItem.publicId,
      mediaItem.fileType === "image" ? "image" : "raw"
    );

    // Delete from database
    await MediaLibrary.findByIdAndDelete(id);

    await ActivityLog.create({
      action: "media_delete",
      details: `Deleted media asset: ${mediaItem.fileName}`,
    });

    revalidatePath("/admin/media");
    return { success: true };
  } catch (error) {
    console.error("Delete media action error:", error);
    return { success: false, error: error.message };
  }
}
