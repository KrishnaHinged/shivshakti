import { EmailTemplate, EmailQueue } from "@/shared/models";

// Hardcoded enterprise-grade default HTML layouts for self-healing templates
const DEFAULT_TEMPLATES = {
  inquiry_received: {
    subject: "Thank you for contacting Shivshakti Elevator Components - Ref: {{inquiryId}}",
    variables: ["customerName", "inquiryId", "productName", "elevatorType", "componentNeeded", "quantity"],
    body: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px; background-color: #ffffff;">
  <div style="background-color: #0a1128; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
    <h1 style="color: #ffffff; margin: 0; font-size: 20px; letter-spacing: 1px;">SHIVSHAKTI ELEVATOR COMPONENTS</h1>
    <p style="color: #f97316; margin: 5px 0 0 0; font-size: 11px; font-weight: bold; uppercase; letter-spacing: 2px;">Touch The Sky With Shivshakti</p>
  </div>
  <div style="padding: 24px; color: #334155; line-height: 1.6;">
    <p style="font-size: 15px; margin-top: 0;">Dear <strong>{{customerName}}</strong>,</p>
    <p style="font-size: 14px;">Thank you for reaching out to us. We have successfully received your inquiry regarding <strong>{{productName}}</strong>.</p>
    
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #0a1128; font-size: 14px; text-transform: uppercase;">Inquiry Summary</h3>
      <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
        <tr>
          <td style="padding: 4px 0; color: #64748b; font-weight: bold;">Reference ID:</td>
          <td style="padding: 4px 0; color: #0f172a;">{{inquiryId}}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #64748b; font-weight: bold;">Elevator Type:</td>
          <td style="padding: 4px 0; color: #0f172a;">{{elevatorType}}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #64748b; font-weight: bold;">Component Needed:</td>
          <td style="padding: 4px 0; color: #0f172a;">{{componentNeeded}}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #64748b; font-weight: bold;">Quantity:</td>
          <td style="padding: 4px 0; color: #0f172a;">{{quantity}}</td>
        </tr>
      </table>
    </div>

    <p style="font-size: 14px;">Our engineering and sales team is reviewing your specifications. An executive will contact you within <strong>24 business hours</strong> with a detailed quotation estimate.</p>
    <p style="font-size: 14px; margin-bottom: 0;">Warm regards,<br><span style="color: #f97316; font-weight: bold;">Shivshakti Estimations Team</span></p>
  </div>
  <div style="border-t: 1px solid #e2e8f0; padding-top: 15px; margin-top: 25px; text-align: center; color: #94a3b8; font-size: 11px;">
    Surat Head Office • Indore Branch • Lucknow Branch<br>
    © 2026 Shivshakti Elevator Components Pvt. Ltd. All rights reserved.
  </div>
</div>
`
  },
  sales_alert: {
    subject: "[CRM Alert] New Lead Submission - Ref: {{inquiryId}}",
    variables: ["inquiryId", "customerName", "company", "phone", "email", "productName", "quantity", "message", "crmLink"],
    body: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #cbd5e1; border-radius: 12px; background-color: #f8fafc;">
  <div style="background-color: #f97316; padding: 15px; border-radius: 8px 8px 0 0; text-align: center; color: #ffffff;">
    <h2 style="margin: 0; font-size: 18px;">[CRM ALERT] NEW LEAD RECEIVED</h2>
  </div>
  <div style="padding: 20px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 0 0 8px 8px; color: #334155;">
    <p style="margin-top: 0; font-size: 14px;">A new B2B quotation request has been submitted by a customer. Details are summarized below:</p>
    
    <table style="width: 100%; font-size: 13px; margin: 15px 0; border-collapse: collapse;">
      <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: bold; width: 140px; color: #64748b;">Lead ID:</td><td style="padding: 8px; font-weight: bold; color: #0f172a;">{{inquiryId}}</td></tr>
      <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: bold; color: #64748b;">Customer Name:</td><td style="padding: 8px; color: #0f172a;">{{customerName}}</td></tr>
      <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: bold; color: #64748b;">Company Name:</td><td style="padding: 8px; color: #0f172a;">{{company}}</td></tr>
      <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: bold; color: #64748b;">Phone Number:</td><td style="padding: 8px; color: #0f172a;">{{phone}}</td></tr>
      <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: bold; color: #64748b;">Email Address:</td><td style="padding: 8px; color: #0f172a;">{{email}}</td></tr>
      <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: bold; color: #64748b;">Product:</td><td style="padding: 8px; color: #0f172a;">{{productName}}</td></tr>
      <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: bold; color: #64748b;">Quantity Required:</td><td style="padding: 8px; color: #0f172a;">{{quantity}}</td></tr>
      <tr><td style="padding: 8px; font-weight: bold; color: #64748b; vertical-align: top;">Message:</td><td style="padding: 8px; color: #0f172a; white-space: pre-wrap;">{{message}}</td></tr>
    </table>

    <div style="text-align: center; margin-top: 25px;">
      <a href="{{crmLink}}" style="background-color: #0a1128; color: #ffffff; padding: 12px 24px; text-decoration: none; font-size: 13px; font-weight: bold; border-radius: 8px; display: inline-block;">VIEW LEAD IN CRM</a>
    </div>
  </div>
</div>
`
  },
  lead_assigned: {
    subject: "[CRM] Lead Assigned to You - Ref: {{inquiryId}}",
    variables: ["inquiryId", "salesPerson", "managerName", "customerName", "company", "phone", "email", "productName", "crmLink"],
    body: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #cbd5e1; border-radius: 12px;">
  <div style="background-color: #0a1128; color: #ffffff; padding: 15px; border-radius: 8px 8px 0 0; text-align: center;">
    <h3 style="margin: 0; font-size: 16px;">NEW LEAD ASSIGNMENT</h3>
  </div>
  <div style="padding: 20px; color: #334155; line-height: 1.6;">
    <p style="margin-top: 0;">Hello <strong>{{salesPerson}}</strong>,</p>
    <p>A new inbound CRM lead has been assigned to you by <strong>{{managerName}}</strong>.</p>
    
    <div style="background-color: #f8fafc; border-left: 4px solid #f97316; padding: 16px; margin: 20px 0;">
      <strong style="font-size: 13px; text-transform: uppercase; color: #f97316; display: block; margin-bottom: 8px;">Lead Overview</strong>
      <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
        <tr><td style="padding: 3px 0; color: #64748b;">Ref ID:</td><td style="padding: 3px 0; color: #0f172a; font-weight: bold;">{{inquiryId}}</td></tr>
        <tr><td style="padding: 3px 0; color: #64748b;">Customer:</td><td style="padding: 3px 0; color: #0f172a;">{{customerName}}</td></tr>
        <tr><td style="padding: 3px 0; color: #64748b;">Company:</td><td style="padding: 3px 0; color: #0f172a;">{{company}}</td></tr>
        <tr><td style="padding: 3px 0; color: #64748b;">Product:</td><td style="padding: 3px 0; color: #0f172a;">{{productName}}</td></tr>
        <tr><td style="padding: 3px 0; color: #64748b;">Contact:</td><td style="padding: 3px 0; color: #0f172a;">{{phone}} / {{email}}</td></tr>
      </table>
    </div>

    <p style="font-size: 14px;">Please review the lead comments and follow up promptly. Click below to view the full log details and update pipeline progress:</p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="{{crmLink}}" style="background-color: #f97316; color: #ffffff; padding: 12px 24px; text-decoration: none; font-size: 13px; font-weight: bold; border-radius: 8px; display: inline-block;">OPEN LEAD WORKSPACE</a>
    </div>
  </div>
</div>
`
  },
  status_updated: {
    subject: "Update on Your Inquiry Ref: {{inquiryId}} - Status: {{status}}",
    variables: ["customerName", "inquiryId", "status", "productName"],
    body: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
  <div style="background-color: #0a1128; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; color: #ffffff;">
    <h2 style="margin: 0; font-size: 18px; color: #ffffff;">INQUIRY PROGRESS UPDATE</h2>
    <p style="color: #f97316; margin: 5px 0 0 0; font-size: 11px; font-weight: bold; text-transform: uppercase;">Reference Ref: {{inquiryId}}</p>
  </div>
  <div style="padding: 24px; color: #334155; line-height: 1.6;">
    <p style="font-size: 15px; margin-top: 0;">Dear <strong>{{customerName}}</strong>,</p>
    <p>We are writing to update you on the status of your inquiry regarding <strong>{{productName}}</strong>.</p>
    
    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0; text-align: center;">
      <span style="font-size: 12px; color: #166534; font-weight: bold; text-transform: uppercase; display: block; margin-bottom: 4px;">Current Pipeline Stage</span>
      <span style="font-size: 20px; color: #15803d; font-weight: bold; text-transform: capitalize;">{{status}}</span>
    </div>

    <p>Our sales team will continue to handle your requirements. If you need immediate assistance or have changes to your specifications, feel free to respond directly to this email.</p>
    <p style="margin-bottom: 0;">Best regards,<br><strong>Shivshakti Estimations Team</strong></p>
  </div>
</div>
`
  },
  follow_up_reminder: {
    subject: "[CRM Reminder] Follow-Up Required: Lead {{inquiryId}} Inactive",
    variables: ["inquiryId", "salesPerson", "customerName", "inactiveDays", "crmLink"],
    body: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f87171; border-radius: 12px;">
  <div style="background-color: #dc2626; color: #ffffff; padding: 15px; border-radius: 8px 8px 0 0; text-align: center;">
    <h3 style="margin: 0; font-size: 16px;">FOLLOW-UP REMINDER</h3>
  </div>
  <div style="padding: 20px; color: #334155; line-height: 1.6;">
    <p style="margin-top: 0;">Hello <strong>{{salesPerson}}</strong>,</p>
    <p>This is an automated notification that the lead for <strong>{{customerName}}</strong> (Inquiry ID: {{inquiryId}}) has been inactive for <strong>{{inactiveDays}} days</strong> with no updates.</p>
    
    <p>Prompt follow-up is critical to maintaining B2B conversion rates. Please contact the client and log your notes in the CRM.</p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="{{crmLink}}" style="background-color: #dc2626; color: #ffffff; padding: 12px 24px; text-decoration: none; font-size: 13px; font-weight: bold; border-radius: 8px; display: inline-block;">OPEN CRM WORKSPACE</a>
    </div>
  </div>
</div>
`
  }
};

/**
 * Replace double-curly template variables
 */
function compileTemplate(text, variables) {
  let compiled = text;
  for (const [key, val] of Object.entries(variables)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    compiled = compiled.replace(regex, val !== undefined && val !== null ? val : "");
  }
  return compiled;
}

export const EmailService = {
  /**
   * Helper to retrieve or initialize default template
   */
  async getTemplate(name) {
    let t = await EmailTemplate.findOne({ name });
    if (!t && DEFAULT_TEMPLATES[name]) {
      const def = DEFAULT_TEMPLATES[name];
      t = await EmailTemplate.create({
        name,
        subject: def.subject,
        body: def.body,
        variables: def.variables
      });
      console.log(`[EmailService] Initialized default email template for "${name}".`);
    }
    return t;
  },

  /**
   * Queue email for asynchronous delivery
   */
  async queueEmail(to, subject, body, templateName = "") {
    try {
      const emailObj = await EmailQueue.create({
        to,
        subject,
        body,
        status: "pending",
        attempts: 0
      });
      return { success: true, id: emailObj._id };
    } catch (e) {
      console.error("[EmailService] Queue email failed:", e.message);
      return { success: false, error: e.message };
    }
  },

  /**
   * Queue Inquiry Received Confirmation to customer
   */
  async sendInquiryConfirmation(inquiry) {
    try {
      const template = await this.getTemplate("inquiry_received");
      if (!template) throw new Error("Template inquiry_received not found");

      const vars = {
        customerName: inquiry.name,
        inquiryId: inquiry._id.toString(),
        productName: inquiry.productTitle || "Elevator Component",
        elevatorType: inquiry.elevatorType || "Standard",
        componentNeeded: inquiry.componentNeeded || "N/A",
        quantity: inquiry.quantity || "1"
      };

      const subject = compileTemplate(template.subject, vars);
      const body = compileTemplate(template.body, vars);

      return this.queueEmail(inquiry.email, subject, body, "inquiry_received");
    } catch (e) {
      console.error("[EmailService] sendInquiryConfirmation error:", e.message);
      return { success: false, error: e.message };
    }
  },

  /**
   * Queue Internal Sales Notification to corporate list
   */
  async sendInternalSalesAlert(inquiry) {
    try {
      const template = await this.getTemplate("sales_alert");
      if (!template) throw new Error("Template sales_alert not found");

      const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const vars = {
        inquiryId: inquiry._id.toString(),
        customerName: inquiry.name,
        company: inquiry.company || "N/A",
        phone: inquiry.phone,
        email: inquiry.email,
        productName: inquiry.productTitle || "Elevator Component",
        quantity: inquiry.quantity || "1",
        message: inquiry.message || "",
        crmLink: `${origin}/admin/inquiries`
      };

      const subject = compileTemplate(template.subject, vars);
      const body = compileTemplate(template.body, vars);

      // Default fallback corporate email
      const salesEmail = process.env.SALES_RECEIVER_EMAIL || "sales.shivshakti22@gmail.com";
      return this.queueEmail(salesEmail, subject, body, "sales_alert");
    } catch (e) {
      console.error("[EmailService] sendInternalSalesAlert error:", e.message);
      return { success: false, error: e.message };
    }
  },

  /**
   * Queue Lead Assigned Alert to Sales Executive
   */
  async sendLeadAssignedEmail(inquiry, executive, managerName) {
    try {
      const template = await this.getTemplate("lead_assigned");
      if (!template) throw new Error("Template lead_assigned not found");

      const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const vars = {
        inquiryId: inquiry._id.toString(),
        salesPerson: executive.name,
        managerName: managerName || "Super Admin",
        customerName: inquiry.name,
        company: inquiry.company || "N/A",
        phone: inquiry.phone,
        email: inquiry.email,
        productName: inquiry.productTitle || "Elevator Component",
        crmLink: `${origin}/admin/inquiries`
      };

      const subject = compileTemplate(template.subject, vars);
      const body = compileTemplate(template.body, vars);

      return this.queueEmail(executive.email, subject, body, "lead_assigned");
    } catch (e) {
      console.error("[EmailService] sendLeadAssignedEmail error:", e.message);
      return { success: false, error: e.message };
    }
  },

  /**
   * Queue Lead Status Update alert to customer
   */
  async sendStatusUpdateEmail(inquiry) {
    try {
      const template = await this.getTemplate("status_updated");
      if (!template) throw new Error("Template status_updated not found");

      const vars = {
        customerName: inquiry.name,
        inquiryId: inquiry._id.toString(),
        status: inquiry.status,
        productName: inquiry.productTitle || "Elevator Component"
      };

      const subject = compileTemplate(template.subject, vars);
      const body = compileTemplate(template.body, vars);

      return this.queueEmail(inquiry.email, subject, body, "status_updated");
    } catch (e) {
      console.error("[EmailService] sendStatusUpdateEmail error:", e.message);
      return { success: false, error: e.message };
    }
  },

  /**
   * Queue Follow-Up reminder to Sales Executive
   */
  async sendFollowUpReminderEmail(inquiry, executive, inactiveDays) {
    try {
      const template = await this.getTemplate("follow_up_reminder");
      if (!template) throw new Error("Template follow_up_reminder not found");

      const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const vars = {
        inquiryId: inquiry._id.toString(),
        salesPerson: executive.name,
        customerName: inquiry.name,
        inactiveDays: inactiveDays.toString(),
        crmLink: `${origin}/admin/inquiries`
      };

      const subject = compileTemplate(template.subject, vars);
      const body = compileTemplate(template.body, vars);

      return this.queueEmail(executive.email, subject, body, "follow_up_reminder");
    } catch (e) {
      console.error("[EmailService] sendFollowUpReminderEmail error:", e.message);
      return { success: false, error: e.message };
    }
  }
};
