"use server";

import { cookies, headers } from "next/headers";
import dbConnect from "@/shared/lib/mongodb";
import EmailTemplate from "@/shared/models/EmailTemplate";
import ActivityLog from "@/shared/models/ActivityLog";
import { verifyToken } from "@/shared/lib/auth";
import { getPermissionsByRole } from "@/shared/permissions/roles";
import { revalidatePath } from "next/cache";

/**
 * Verify caller has MANAGE_EMAIL_TEMPLATES privileges
 */
async function verifyTemplatePrivileges() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;
  if (!token) throw new Error("Unauthorized access.");

  const decoded = verifyToken(token);
  if (!decoded) throw new Error("Unauthorized session.");

  const permissions = getPermissionsByRole(decoded.role);
  if (!permissions.includes("MANAGE_EMAIL_TEMPLATES")) {
    throw new Error("Forbidden: Email Template Management permissions required.");
  }

  // Get IP and User-Agent for audit logs
  const reqHeaders = await headers();
  const userAgent = reqHeaders.get("user-agent") || "";
  const ipAddress = reqHeaders.get("x-forwarded-for")?.split(",")[0] || reqHeaders.get("x-real-ip") || "127.0.0.1";

  return { actor: decoded, ipAddress, userAgent };
}

/**
 * Fetch all email templates
 */
export async function getEmailTemplatesAction() {
  try {
    await verifyTemplatePrivileges();
    await dbConnect();

    // Trigger self-healing seeding of default templates if none exist
    const { EmailService } = require("@/shared/services/email.service");
    await Promise.all([
      EmailService.getTemplate("inquiry_received"),
      EmailService.getTemplate("sales_alert"),
      EmailService.getTemplate("lead_assigned"),
      EmailService.getTemplate("status_updated"),
      EmailService.getTemplate("follow_up_reminder")
    ]);

    const templates = await EmailTemplate.find().sort({ name: 1 });
    return { success: true, data: JSON.parse(JSON.stringify(templates)) };
  } catch (error) {
    return { success: false, error: error.message || "Failed to fetch email templates." };
  }
}

/**
 * Update an existing email template
 */
export async function updateEmailTemplateAction(templateId, formData) {
  try {
    const { actor, ipAddress, userAgent } = await verifyTemplatePrivileges();
    await dbConnect();

    const subject = formData.get("subject")?.toString().trim();
    const body = formData.get("body")?.toString();

    if (!subject || !body) {
      return { success: false, error: "Subject and Body are required." };
    }

    const template = await EmailTemplate.findById(templateId);
    if (!template) {
      return { success: false, error: "Email template not found." };
    }

    template.subject = subject;
    template.body = body;
    await template.save();

    await ActivityLog.create({
      action: "email_template_updated",
      details: `Updated email template: ${template.name} by ${actor.email}`,
      ipAddress,
      userAgent
    });

    revalidatePath("/admin/email-templates");
    return { success: true, data: JSON.parse(JSON.stringify(template)) };
  } catch (error) {
    return { success: false, error: error.message || "Failed to update email template." };
  }
}
