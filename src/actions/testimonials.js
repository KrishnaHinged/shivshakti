"use server";

import dbConnect from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";
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
 * Create a new testimonial
 */
export async function createTestimonialAction(formData) {
  try {
    await verifyAuth();
    await dbConnect();

    const name = formData.get("name")?.toString().trim();
    const role = formData.get("role")?.toString().trim();
    const rating = parseInt(formData.get("rating")?.toString() || "5", 10);
    const review = formData.get("review")?.toString().trim();
    const image = formData.get("image")?.toString().trim() || "";
    const status = formData.get("status")?.toString() || "published";
    const displayOrder = parseInt(formData.get("displayOrder")?.toString() || "0", 10);

    if (!name || !role || !review) {
      return { success: false, error: "Missing required fields." };
    }

    const item = await Testimonial.create({
      name,
      role,
      rating,
      review,
      image,
      status,
      displayOrder,
    });

    await ActivityLog.create({
      action: "testimonial_create",
      details: `Added testimonial by client: ${name}`,
    });

    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return { success: true, data: JSON.parse(JSON.stringify(item)) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Edit an existing testimonial
 */
export async function editTestimonialAction(id, formData) {
  try {
    await verifyAuth();
    await dbConnect();

    const name = formData.get("name")?.toString().trim();
    const role = formData.get("role")?.toString().trim();
    const rating = parseInt(formData.get("rating")?.toString() || "5", 10);
    const review = formData.get("review")?.toString().trim();
    const image = formData.get("image")?.toString().trim() || "";
    const status = formData.get("status")?.toString() || "published";
    const displayOrder = parseInt(formData.get("displayOrder")?.toString() || "0", 10);

    if (!name || !role || !review) {
      return { success: false, error: "Missing required fields." };
    }

    const item = await Testimonial.findByIdAndUpdate(
      id,
      {
        name,
        role,
        rating,
        review,
        image,
        status,
        displayOrder,
      },
      { new: true }
    );

    if (!item) return { success: false, error: "Testimonial record not found." };

    await ActivityLog.create({
      action: "testimonial_edit",
      details: `Edited testimonial by client: ${name}`,
    });

    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return { success: true, data: JSON.parse(JSON.stringify(item)) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Delete a testimonial
 */
export async function deleteTestimonialAction(id) {
  try {
    await verifyAuth();
    await dbConnect();

    const item = await Testimonial.findByIdAndDelete(id);
    if (!item) return { success: false, error: "Testimonial record not found." };

    await ActivityLog.create({
      action: "testimonial_delete",
      details: `Deleted testimonial by client: ${item.name}`,
    });

    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
