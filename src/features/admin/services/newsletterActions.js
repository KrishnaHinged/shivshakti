"use server";

import dbConnect from "@/shared/lib/mongodb";
import Newsletter from "@/shared/models/Newsletter";
import ActivityLog from "@/shared/models/ActivityLog";
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
 * Public subscription action
 */
export async function subscribeNewsletterAction(formData) {
  try {
    await dbConnect();
    const email = formData.get("email")?.toString().trim().toLowerCase();

    if (!email) {
      return { success: false, error: "Email address is required." };
    }

    const exists = await Newsletter.findOne({ email });
    if (exists) {
      if (exists.status === "unsubscribed") {
        exists.status = "active";
        await exists.save();
        return {
          success: true,
          message: "Welcome back! Subscription re-activated.",
        };
      }
      return { success: true, message: "You are already subscribed." };
    }

    await Newsletter.create({ email });

    console.log(`[NEW SUBSCRIPTION] Email: ${email}`);
    return { success: true, message: "Thank you for subscribing!" };
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return {
      success: false,
      error: "Failed to subscribe. Please try again.",
    };
  }
}

/**
 * Remove subscriber (Admin action)
 */
export async function deleteSubscriberAction(id) {
  try {
    await verifyAuth();
    await dbConnect();

    const sub = await Newsletter.findByIdAndDelete(id);
    if (!sub) return { success: false, error: "Subscriber record not found." };

    await ActivityLog.create({
      action: "newsletter_subscriber_delete",
      details: `Removed newsletter subscriber: ${sub.email}`,
    });

    revalidatePath("/admin/newsletter");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
