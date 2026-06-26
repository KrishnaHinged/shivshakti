"use server";

import dbConnect from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";
import Admin from "@/models/Admin";
import ActivityLog from "@/models/ActivityLog";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { verifyToken } from "@/lib/auth";
import { EmailService } from "@/services/email/email.service";
import { hasPermission } from "@/permissions/permissions";
import { PERMISSIONS } from "@/permissions/roles";

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

      // Queue automated emails (customer receipt & internal sales alert)
      try {
        await EmailService.sendInquiryConfirmation(inquiry);
        await EmailService.sendInternalSalesAlert(inquiry);
      } catch (emailErr) {
        console.error("Failed to queue submission emails:", emailErr);
      }

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

      // Queue automated emails (customer receipt & internal sales alert)
      try {
        await EmailService.sendInquiryConfirmation(inquiry);
        await EmailService.sendInternalSalesAlert(inquiry);
      } catch (emailErr) {
        console.error("Failed to queue submission emails:", emailErr);
      }

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
    const decoded = await verifyAuth();
    await dbConnect();

    // Check permission
    if (!hasPermission(decoded, PERMISSIONS.EDIT_CRM)) {
      return { success: false, error: "Access Denied: You do not have permission to edit CRM leads." };
    }

    const inquiry = await Inquiry.findById(inquiryId);
    if (!inquiry) return { success: false, error: "Inquiry not found." };

    // Executive lock: Can only edit assigned leads
    if (decoded.role === "SALES_EXECUTIVE" && inquiry.assignedTo?.toString() !== decoded.id) {
      return { success: false, error: "Access Denied: You can only update your assigned leads." };
    }

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

    const oldStatus = inquiry.status;
    if (oldStatus.toLowerCase() !== status.toLowerCase()) {
      inquiry.status = status;
      await inquiry.save();

      await ActivityLog.create({
        action: "inquiry_status_update",
        details: `Updated status for lead ${inquiry.name} to: ${status} by ${decoded.email}`,
      });

      // Hook up status update email to customer
      try {
        await EmailService.sendStatusUpdateEmail(inquiry);
      } catch (emailErr) {
        console.error("Failed to send status update email:", emailErr);
      }
    }

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

    // Check permission
    if (!hasPermission(decoded, PERMISSIONS.EDIT_CRM)) {
      return { success: false, error: "Access Denied: You do not have permission to edit CRM leads." };
    }

    const inquiry = await Inquiry.findById(inquiryId);
    if (!inquiry) return { success: false, error: "Inquiry not found." };

    // Executive lock: Can only add notes to assigned leads
    if (decoded.role === "SALES_EXECUTIVE" && inquiry.assignedTo?.toString() !== decoded.id) {
      return { success: false, error: "Access Denied: You can only add notes to your assigned leads." };
    }

    const adminName = decoded.email ? decoded.email.split("@")[0] : "Admin";

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
      details: `Added new timeline note to lead ${inquiry.name}: "${notes.substring(0, 30)}..." by ${decoded.email}`,
    });

    // Fetch fully updated doc with populate for return
    const updatedInquiry = await Inquiry.findById(inquiryId).populate("assignedTo", "name email role");

    revalidatePath("/admin/inquiries");
    return { success: true, data: JSON.parse(JSON.stringify(updatedInquiry)) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Delete Inquiry Lead
 */
export async function deleteInquiryAction(inquiryId) {
  try {
    const decoded = await verifyAuth();
    await dbConnect();

    // Check permission
    if (!hasPermission(decoded, PERMISSIONS.DELETE_CRM)) {
      return { success: false, error: "Access Denied: You do not have permission to delete leads." };
    }

    const inquiry = await Inquiry.findByIdAndDelete(inquiryId);
    if (!inquiry) return { success: false, error: "Inquiry not found." };

    await ActivityLog.create({
      action: "inquiry_delete",
      details: `Deleted lead record: ${inquiry.name} by ${decoded.email}`,
    });

    revalidatePath("/admin/inquiries");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Assign / Reassign Inquiry Lead to an active Admin
 */
export async function assignInquiryAction(inquiryId, assigneeId) {
  try {
    const decoded = await verifyAuth();
    await dbConnect();

    // Only SUPER_ADMIN and SALES_MANAGER can assign leads
    if (!["SUPER_ADMIN", "SALES_MANAGER"].includes(decoded.role)) {
      return { success: false, error: "Access Denied: Only managers and super admins can assign leads." };
    }

    const inquiry = await Inquiry.findById(inquiryId);
    if (!inquiry) return { success: false, error: "Inquiry not found." };

    const oldAssigneeId = inquiry.assignedTo?.toString() || null;
    const newAssigneeId = assigneeId ? assigneeId.toString() : null;

    if (oldAssigneeId !== newAssigneeId) {
      const manager = await Admin.findById(decoded.id);
      const managerName = manager?.name || decoded.email;

      let executive = null;
      if (newAssigneeId) {
        executive = await Admin.findById(newAssigneeId);
        if (!executive || !executive.isActive) {
          return { success: false, error: "Selected assignee is not an active admin." };
        }
      }

      inquiry.assignedTo = newAssigneeId || null;
      inquiry.assignedBy = decoded.id;
      inquiry.assignedAt = newAssigneeId ? new Date() : null;
      await inquiry.save();

      // Log assignment activity
      await ActivityLog.create({
        action: "lead_assignment",
        details: `Assigned lead ${inquiry.name} to ${executive ? executive.name : "Unassigned"} by ${managerName}`,
      });

      // Send assignment email
      if (executive) {
        try {
          await EmailService.sendLeadAssignedEmail(inquiry, executive, managerName);
        } catch (emailErr) {
          console.error("Failed to send lead assigned email:", emailErr);
        }
      }
    }

    const updatedInquiry = await Inquiry.findById(inquiryId).populate("assignedTo", "name email role");

    revalidatePath("/admin/inquiries");
    return { success: true, data: JSON.parse(JSON.stringify(updatedInquiry)) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

