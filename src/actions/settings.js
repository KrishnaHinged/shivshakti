"use server";

import dbConnect from "@/lib/mongodb";
import Setting from "@/models/Setting";
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
 * Update global website configurations
 */
export async function updateSettingsAction(formData) {
  try {
    await verifyAuth();
    await dbConnect();

    const companyName = formData.get("companyName")?.toString().trim();
    const tagline = formData.get("tagline")?.toString().trim();
    const subTagline = formData.get("subTagline")?.toString().trim();
    const whatsapp = formData.get("whatsapp")?.toString().trim();
    const gst = formData.get("gst")?.toString().trim();
    const iec = formData.get("iec")?.toString().trim();
    const banker = formData.get("banker")?.toString().trim();
    const googleMapsEmbed = formData.get("googleMapsEmbed")?.toString().trim();
    const logoUrl = formData.get("logoUrl")?.toString().trim();
    const faviconUrl = formData.get("faviconUrl")?.toString().trim();
    const footerDescription = formData.get("footerDescription")?.toString().trim();

    const emailsStr = formData.get("emails")?.toString().trim() || "";
    const phonesStr = formData.get("phones")?.toString().trim() || "";
    const addressesStr = formData.get("addresses")?.toString().trim() || "[]";

    const facebook = formData.get("facebook")?.toString().trim() || "";
    const instagram = formData.get("instagram")?.toString().trim() || "";
    const whatsappLink = formData.get("whatsappLink")?.toString().trim() || "";

    const emails = emailsStr.split(",").map(e => e.trim()).filter(Boolean);
    const phones = phonesStr.split(",").map(p => p.trim()).filter(Boolean);

    let addresses = [];
    try {
      addresses = JSON.parse(addressesStr);
    } catch (e) {
      return { success: false, error: "Invalid branch addresses JSON format." };
    }

    const updateObj = {
      companyName,
      tagline,
      subTagline,
      whatsapp,
      gst,
      iec,
      banker,
      googleMapsEmbed,
      logoUrl,
      faviconUrl,
      footerDescription,
      emails,
      phones,
      addresses,
      socialLinks: {
        facebook,
        instagram,
        whatsapp: whatsappLink,
      },
    };

    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create(updateObj);
    } else {
      settings = await Setting.findByIdAndUpdate(settings._id, updateObj, {
        new: true,
      });
    }

    await ActivityLog.create({
      action: "settings_update",
      details: "Global website configurations and statutory details updated.",
    });

    revalidatePath("/");
    revalidatePath("/admin/settings");
    return { success: true, data: JSON.parse(JSON.stringify(settings)) };
  } catch (error) {
    console.error("Update settings error:", error);
    return { success: false, error: error.message };
  }
}
