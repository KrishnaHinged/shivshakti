"use server";

import dbConnect from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";
import ActivityLog from "@/models/ActivityLog";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { verifyToken } from "@/lib/auth";

/**
 * Verify if admin is logged in and decode details
 */
async function verifyAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;
  if (!token) throw new Error("Unauthorized action execution.");
  const decoded = verifyToken(token);
  if (!decoded) throw new Error("Invalid or expired session token.");
  return decoded;
}

/**
 * Submit inquiry from public homepage contact form or product details (Public Action)
 */
export async function createInquiryAction(formData) {
  try {
    await dbConnect();
    const name = formData.get("name")?.toString().trim();
    const company = formData.get("company")?.toString().trim() || "";
    const phone = formData.get("phone")?.toString().trim();
    const email = formData.get("email")?.toString().trim().toLowerCase();
    const message = formData.get("message")?.toString().trim();

    // Hidden product details
    const productId = formData.get("productId")?.toString().trim() || "";
    const productSlug = formData.get("productSlug")?.toString().trim() || "";
    const productTitle = formData.get("productTitle")?.toString().trim() || "";

    // Determine if it is a smart contact form submission
    const isSmartForm = formData.get("isSmartForm")?.toString() === "true" || !productId;

    if (isSmartForm) {
      const elevatorType = formData.get("elevatorType")?.toString().trim();
      const componentNeeded = formData.get("componentNeeded")?.toString().trim();
      const quantity = formData.get("quantity")?.toString().trim();

      // Server-side validation
      if (!name || !phone || !email || !elevatorType || !componentNeeded || !quantity || !message) {
        return { success: false, error: "Please fill in all required fields." };
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { success: false, error: "Please enter a valid email address." };
      }

      if (phone.replace(/\D/g, "").length < 10) {
        return { success: false, error: "Please enter a valid phone number (at least 10 digits)." };
      }

      const qtyVal = parseInt(quantity, 10);
      if (isNaN(qtyVal) || qtyVal <= 0) {
        return { success: false, error: "Quantity must be a positive integer." };
      }

      const inquiry = await Inquiry.create({
        name,
        company,
        phone,
        email,
        message,
        elevatorType,
        componentNeeded,
        quantity,
        productInterest: componentNeeded,
        status: "New",
      });

      console.log(`[NEW SMART LEAD] ID: ${inquiry._id}, Name: ${name}`);
      return { success: true };
    } else {
      // Product page inquiry (legacy/quick style)
      const city = formData.get("city")?.toString().trim() || "N/A";
      const productInterest = formData.get("productInterest")?.toString().trim() || productTitle || "Product Inquiry";
      const customizationColor = formData.get("customizationColor")?.toString().trim() || "";
      const customizationFinish = formData.get("customizationFinish")?.toString().trim() || "";

      if (!name || !phone || !email || !message) {
        return { success: false, error: "Please fill in name, phone, email, and message." };
      }

      const inquiry = await Inquiry.create({
        name,
        company,
        phone,
        email,
        city,
        productInterest,
        message,
        productId,
        productSlug,
        productTitle,
        customizationColor,
        customizationFinish,
        status: "New",
      });

      console.log(`[NEW PRODUCT LEAD] ID: ${inquiry._id}, Product: ${productTitle}`);
      return { success: true };
    }
  } catch (error) {
    console.error("Create inquiry error:", error);
    return {
      success: false,
      error: "Failed to submit inquiry. Please try again.",
    };
  }
}

/**
 * Update Inquiry Lead Status
 */
export async function updateInquiryStatusAction(inquiryId, status) {
  try {
    await verifyAuth();
    await dbConnect();

    const allowed = [
      "new",
      "contacted",
      "quotation_sent",
      "converted",
      "closed",
      "rejected",
      "New",
      "Contacted",
      "Qualified",
      "Closed",
      "Rejected",
    ];
    if (!allowed.includes(status)) {
      return { success: false, error: "Invalid status type." };
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      inquiryId,
      { status },
      { new: true }
    );
    if (!inquiry) return { success: false, error: "Inquiry not found." };

    await ActivityLog.create({
      action: "inquiry_status_update",
      details: `Updated status for lead ${inquiry.name} to: ${status}`,
    });

    revalidatePath("/admin/inquiries");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Update Inquiry Follow-up Notes (Add Note to Timeline)
 */
export async function addInquiryNoteAction(inquiryId, notes) {
  try {
    const decoded = await verifyAuth();
    await dbConnect();

    const adminName = decoded.email ? decoded.email.split("@")[0] : "Admin";

    const inquiry = await Inquiry.findById(inquiryId);
    if (!inquiry) return { success: false, error: "Inquiry not found." };

    // Gracefully handle legacy string notes
    if (!Array.isArray(inquiry.notes)) {
      const legacyNotes = typeof inquiry.notes === "string" ? inquiry.notes : "";
      inquiry.notes = [];
      if (legacyNotes.trim()) {
        inquiry.notes.push({
          text: legacyNotes,
          adminName: "System",
          createdAt: inquiry.updatedAt || new Date()
        });
      }
    }

    inquiry.notes.push({
      text: notes,
      adminName: adminName,
      createdAt: new Date(),
    });

    await inquiry.save();

    await ActivityLog.create({
      action: "inquiry_notes_update",
      details: `Added new timeline note to lead ${inquiry.name}: "${notes.substring(0, 30)}..."`,
    });

    revalidatePath("/admin/inquiries");
    return { success: true, data: JSON.parse(JSON.stringify(inquiry)) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Delete Inquiry Lead
 */
export async function deleteInquiryAction(inquiryId) {
  try {
    await verifyAuth();
    await dbConnect();

    const inquiry = await Inquiry.findByIdAndDelete(inquiryId);
    if (!inquiry) return { success: false, error: "Inquiry not found." };

    await ActivityLog.create({
      action: "inquiry_delete",
      details: `Deleted lead record: ${inquiry.name}`,
    });

    revalidatePath("/admin/inquiries");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
