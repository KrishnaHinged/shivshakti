"use server";

import { cookies, headers } from "next/headers";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";
import ActivityLog from "@/models/ActivityLog";
import { verifyToken, hashPassword } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * Verify caller has SUPER_ADMIN privileges
 */
async function verifySuperAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;
  if (!token) throw new Error("Unauthorized access.");

  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== "SUPER_ADMIN") {
    throw new Error("Forbidden: Super Admin role required.");
  }

  // Get IP and User-Agent for audit logs
  const reqHeaders = await headers();
  const userAgent = reqHeaders.get("user-agent") || "";
  const ipAddress = reqHeaders.get("x-forwarded-for")?.split(",")[0] || reqHeaders.get("x-real-ip") || "127.0.0.1";

  return { actor: decoded, ipAddress, userAgent };
}

/**
 * Fetch all admin users
 */
export async function getAdminsAction() {
  try {
    await verifySuperAdmin();
    await dbConnect();

    const admins = await Admin.find().sort({ createdAt: -1 });
    return { success: true, data: JSON.parse(JSON.stringify(admins)) };
  } catch (error) {
    return { success: false, error: error.message || "Failed to fetch users." };
  }
}

/**
 * Create a new administrator account
 */
export async function createAdminAction(formData) {
  try {
    const { actor, ipAddress, userAgent } = await verifySuperAdmin();
    await dbConnect();

    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim().toLowerCase();
    const password = formData.get("password")?.toString();
    const role = formData.get("role")?.toString();

    if (!name || !email || !password || !role) {
      return { success: false, error: "Missing required fields." };
    }

    // Check if email already exists
    const exists = await Admin.findOne({ email });
    if (exists) {
      return { success: false, error: "Email is already registered." };
    }

    const passwordHash = await hashPassword(password);

    const newAdmin = await Admin.create({
      name,
      email,
      password: passwordHash,
      role,
      isActive: true,
      createdBy: actor.id
    });

    await ActivityLog.create({
      action: "user_created",
      details: `Created admin user: ${name} (${email}) with role ${role} by ${actor.email}`,
      ipAddress,
      userAgent
    });

    revalidatePath("/admin/users");
    return { success: true, data: JSON.parse(JSON.stringify(newAdmin)) };
  } catch (error) {
    return { success: false, error: error.message || "Failed to create administrator." };
  }
}

/**
 * Edit an existing admin account
 */
export async function editAdminAction(adminId, formData) {
  try {
    const { actor, ipAddress, userAgent } = await verifySuperAdmin();
    await dbConnect();

    const name = formData.get("name")?.toString().trim();
    const role = formData.get("role")?.toString();
    const permissionsStr = formData.get("permissions")?.toString() || "[]";
    let permissions = [];

    try {
      permissions = JSON.parse(permissionsStr);
    } catch (e) {
      // fallback
    }

    if (!name || !role) {
      return { success: false, error: "Missing required fields." };
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return { success: false, error: "User account not found." };
    }

    const oldRole = admin.role;
    admin.name = name;
    admin.role = role;
    admin.permissions = permissions;
    await admin.save();

    let detailStr = `Updated user ${admin.email}: name to "${name}", role to ${role}`;
    if (oldRole !== role) {
      detailStr += ` (changed from ${oldRole})`;
    }

    await ActivityLog.create({
      action: oldRole !== role ? "role_changed" : "user_updated",
      details: `${detailStr} by ${actor.email}`,
      ipAddress,
      userAgent
    });

    revalidatePath("/admin/users");
    return { success: true, data: JSON.parse(JSON.stringify(admin)) };
  } catch (error) {
    return { success: false, error: error.message || "Failed to edit administrator." };
  }
}

/**
 * Suspend/Reactivate an admin account
 */
export async function toggleAdminStatusAction(adminId) {
  try {
    const { actor, ipAddress, userAgent } = await verifySuperAdmin();
    await dbConnect();

    // Prevent suspending oneself
    if (adminId === actor.id) {
      return { success: false, error: "You cannot suspend your own account." };
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return { success: false, error: "User account not found." };
    }

    admin.isActive = !admin.isActive;
    await admin.save();

    await ActivityLog.create({
      action: "user_status_toggled",
      details: `${admin.isActive ? "Activated" : "Suspended"} user: ${admin.email} by ${actor.email}`,
      ipAddress,
      userAgent
    });

    revalidatePath("/admin/users");
    return { success: true, data: JSON.parse(JSON.stringify(admin)) };
  } catch (error) {
    return { success: false, error: error.message || "Failed to change user status." };
  }
}

/**
 * Reset password of an admin account
 */
export async function resetAdminPasswordAction(adminId, newPassword) {
  try {
    const { actor, ipAddress, userAgent } = await verifySuperAdmin();
    await dbConnect();

    if (!newPassword || newPassword.length < 5) {
      return { success: false, error: "Password must be at least 5 characters long." };
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return { success: false, error: "User account not found." };
    }

    const passwordHash = await hashPassword(newPassword);
    admin.password = passwordHash;
    await admin.save();

    await ActivityLog.create({
      action: "user_password_reset",
      details: `Reset password for user: ${admin.email} by super admin ${actor.email}`,
      ipAddress,
      userAgent
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || "Failed to reset password." };
  }
}
