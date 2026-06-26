"use server";

import { cookies, headers } from "next/headers";
import { dbConnect, comparePassword, hashPassword, signToken, verifyToken } from "@/shared/lib";
import { Admin, ActivityLog } from "@/shared/models";
import { getPermissionsByRole } from "@/shared/permissions";

/**
 * Handle Admin Login
 */
export async function loginAction(formData) {
  try {
    await dbConnect();
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString();

    // Get IP and User-Agent
    const reqHeaders = await headers();
    const userAgent = reqHeaders.get("user-agent") || "";
    const ipAddress = reqHeaders.get("x-forwarded-for")?.split(",")[0] || reqHeaders.get("x-real-ip") || "127.0.0.1";

    if (!email || !password) {
      return { success: false, error: "Please enter email and password." };
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      await ActivityLog.create({
        action: "login_failure",
        details: `Failed login attempt for unregistered email: ${email}`,
        ipAddress,
        userAgent,
      });
      return { success: false, error: "Invalid credentials." };
    }

    const isMatch = await comparePassword(password, admin.password);
    if (!isMatch) {
      await ActivityLog.create({
        action: "login_failure",
        details: `Failed password attempt for admin: ${email}`,
        ipAddress,
        userAgent,
      });
      return { success: false, error: "Invalid credentials." };
    }

    // Check if account is suspended
    if (admin.isActive === false) {
      await ActivityLog.create({
        action: "login_failure",
        details: `Login attempt for suspended admin: ${email}`,
        ipAddress,
        userAgent,
      });
      return { success: false, error: "Your account has been suspended." };
    }

    // Update last login timestamp
    admin.lastLoginAt = new Date();
    await admin.save();

    // Get permissions list
    const userPermissions = getPermissionsByRole(admin.role || "SALES_EXECUTIVE");

    // Sign JWT Token with role and permissions
    const token = signToken({
      id: admin._id.toString(),
      email: admin.email,
      role: admin.role || "SALES_EXECUTIVE",
      permissions: userPermissions,
    });

    // Set cookie (Next.js 15+ Async cookies compatibility)
    const cookieStore = await cookies();
    cookieStore.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    // Log activity
    await ActivityLog.create({
      action: "login_success",
      details: `Successful login for admin: ${email} (${admin.role || "SALES_EXECUTIVE"})`,
      ipAddress,
      userAgent,
    });

    return { success: true };
  } catch (error) {
    console.error("Login action error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

/**
 * Handle Admin Logout
 */
export async function logoutAction() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("admin-token");

    await dbConnect();
    await ActivityLog.create({
      action: "logout",
      details: "Admin logged out successfully.",
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "Logout failed." };
  }
}

/**
 * Change Admin Password
 */
export async function changePasswordAction(formData) {
  try {
    await dbConnect();

    // Verify auth first
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token")?.value;
    if (!token) return { success: false, error: "Unauthorized." };

    const currentPassword = formData.get("currentPassword")?.toString();
    const newPassword = formData.get("newPassword")?.toString();
    const confirmPassword = formData.get("confirmPassword")?.toString();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return { success: false, error: "All fields are required." };
    }

    if (newPassword !== confirmPassword) {
      return { success: false, error: "Passwords do not match." };
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) return { success: false, error: "Unauthorized." };

    const admin = await Admin.findById(decoded.id);
    if (!admin) return { success: false, error: "Admin account not found." };

    const isMatch = await comparePassword(currentPassword, admin.password);
    if (!isMatch) {
      return { success: false, error: "Incorrect current password." };
    }

    admin.password = await hashPassword(newPassword);
    await admin.save();

    await ActivityLog.create({
      action: "change_password",
      details: "Admin password updated successfully.",
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "Error changing password." };
  }
}

/**
 * Request OTP via Forgot Password Flow
 */
export async function requestOtpAction(formData) {
  try {
    await dbConnect();
    const email = formData.get("email")?.toString().trim();
    if (!email) return { success: false, error: "Email is required." };

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      // Return generic success to prevent email enumeration attacks
      return {
        success: true,
        message: "If the email is registered, an OTP code has been generated.",
      };
    }

    // Generate a simple 6-digit verification code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    admin.otpCode = otp;
    admin.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
    await admin.save();

    // Log the OTP in activity logs for development accessibility
    await ActivityLog.create({
      action: "otp_request",
      details: `Generated recovery OTP code: ${otp} for ${email}`,
    });

    console.log(`[RECOVERY OTP GENERATED] For: ${email} -> CODE: ${otp}`);
    return {
      success: true,
      message: "OTP has been generated. Please check the system console or audit logs.",
    };
  } catch (error) {
    return { success: false, error: "Request failed." };
  }
}

/**
 * Verify OTP and Reset Password
 */
export async function resetPasswordWithOtpAction(formData) {
  try {
    await dbConnect();
    const email = formData.get("email")?.toString().trim();
    const otp = formData.get("otp")?.toString().trim();
    const newPassword = formData.get("newPassword")?.toString();

    if (!email || !otp || !newPassword) {
      return { success: false, error: "All fields are required." };
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (
      !admin ||
      admin.otpCode !== otp ||
      !admin.otpExpiry ||
      admin.otpExpiry < new Date()
    ) {
      return { success: false, error: "Invalid or expired OTP." };
    }

    admin.password = await hashPassword(newPassword);
    admin.otpCode = null;
    admin.otpExpiry = null;
    await admin.save();

    await ActivityLog.create({
      action: "reset_password",
      details: `Password reset successfully via OTP verification for ${email}`,
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "Reset failed." };
  }
}
