"use server";

import dbConnect from "@/lib/mongodb";
import Seo from "@/models/Seo";
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
 * Save page level meta and schema details
 */
export async function updateSeoAction(formData) {
  try {
    await verifyAuth();
    await dbConnect();

    const pagePath = formData.get("pagePath")?.toString().trim().toLowerCase();
    const metaTitle = formData.get("metaTitle")?.toString().trim();
    const metaDescription = formData.get("metaDescription")?.toString().trim();
    const openGraphImage = formData.get("openGraphImage")?.toString().trim() || "";
    const schemaMarkup = formData.get("schemaMarkup")?.toString().trim() || "";

    if (!pagePath || !metaTitle || !metaDescription) {
      return { success: false, error: "Missing required fields." };
    }

    if (schemaMarkup) {
      try {
        JSON.parse(schemaMarkup);
      } catch (e) {
        return { success: false, error: "Schema Markup must be valid JSON." };
      }
    }

    let seo = await Seo.findOne({ pagePath });
    if (!seo) {
      seo = await Seo.create({
        pagePath,
        metaTitle,
        metaDescription,
        openGraphImage,
        schemaMarkup,
      });
    } else {
      seo = await Seo.findOneAndUpdate(
        { pagePath },
        { metaTitle, metaDescription, openGraphImage, schemaMarkup },
        { new: true }
      );
    }

    await ActivityLog.create({
      action: "seo_update",
      details: `Updated SEO metadata configurations for path: ${pagePath}`,
    });

    revalidatePath("/");
    revalidatePath("/admin/seo");
    return { success: true, data: JSON.parse(JSON.stringify(seo)) };
  } catch (error) {
    console.error("Update SEO action error:", error);
    return { success: false, error: error.message };
  }
}
