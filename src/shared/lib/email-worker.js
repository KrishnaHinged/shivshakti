import EmailQueue from "@/shared/models/EmailQueue";
import fs from "fs";
import path from "path";

let workerInterval = null;
let isProcessing = false;

async function processQueue() {
  if (isProcessing) return;
  isProcessing = true;

  try {
    const pending = await EmailQueue.find({
      status: "pending",
      attempts: { $lt: 3 },
      scheduledAt: { $lte: new Date() }
    }).limit(10);

    if (pending.length === 0) {
      isProcessing = false;
      return;
    }

    console.log(`[EmailWorker] Processing ${pending.length} pending emails...`);

    // Check if SMTP is configured
    const smtpConfigured = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
    let transporter = null;

    if (smtpConfigured) {
      const nodemailer = require("nodemailer");
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    }

    for (const email of pending) {
      email.attempts += 1;
      email.lastAttemptAt = new Date();

      try {
        if (smtpConfigured && transporter) {
          const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER;
          await transporter.sendMail({
            from: fromAddress,
            to: email.to,
            subject: email.subject,
            html: email.body
          });
          console.log(`[EmailWorker] Sent email ${email._id} to ${email.to} via SMTP.`);
        } else {
          // Dev Fallback: write to scratch folder
          const scratchDir = path.join(process.cwd(), "scratch", "emails");
          if (!fs.existsSync(scratchDir)) {
            fs.mkdirSync(scratchDir, { recursive: true });
          }

          const fileContent = `
<!--
To: ${email.to}
Subject: ${email.subject}
Date: ${new Date().toISOString()}
-->
${email.body}
`;
          const filePath = path.join(scratchDir, `email-${email._id}.html`);
          fs.writeFileSync(filePath, fileContent, "utf8");
          console.log(`[EmailWorker] DEV MODE: Saved email ${email._id} to ${filePath}`);
        }

        email.status = "sent";
        email.error = null;
      } catch (err) {
        console.error(`[EmailWorker] Failed to send email ${email._id}:`, err.message);
        email.error = err.message;
        if (email.attempts >= 3) {
          email.status = "failed";
        }
      }

      await email.save();
    }
  } catch (e) {
    console.error("[EmailWorker] Queue processing error:", e.message);
  } finally {
    isProcessing = false;
  }
}

/**
 * Initializes the background email worker.
 */
export function initEmailWorker() {
  if (workerInterval) return;

  console.log("[EmailWorker] Initializing queue background worker (15s interval).");
  // Run queue processor every 15 seconds
  workerInterval = setInterval(processQueue, 15000);
}

/**
 * Trigger queue processing manually.
 */
export async function triggerEmailProcessor() {
  await processQueue();
}

/**
 * Verifies if SMTP is configured.
 */
export async function verifySMTPConfig() {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}
