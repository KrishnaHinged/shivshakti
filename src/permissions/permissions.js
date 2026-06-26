import { getPermissionsByRole, PERMISSIONS } from "./roles";

/**
 * Check if a user has a specific permission
 */
export function hasPermission(user, permission) {
  if (!user || !user.role) return false;
  
  // Super Admin bypasses all checks
  if (user.role === "SUPER_ADMIN") return true;
  
  const userPerms = getPermissionsByRole(user.role);
  return userPerms.includes(permission);
}

/**
 * Access Check Helpers
 */
export const canViewCRM = (user) => hasPermission(user, PERMISSIONS.VIEW_CRM);
export const canEditCRM = (user) => hasPermission(user, PERMISSIONS.EDIT_CRM);
export const canDeleteCRM = (user) => hasPermission(user, PERMISSIONS.DELETE_CRM);
export const canExportCRM = (user) => hasPermission(user, PERMISSIONS.EXPORT_CRM);
export const canManageUsers = (user) => hasPermission(user, PERMISSIONS.MANAGE_USERS);
export const canViewSettings = (user) => hasPermission(user, PERMISSIONS.VIEW_SETTINGS);
export const canEditSettings = (user) => hasPermission(user, PERMISSIONS.EDIT_SETTINGS);
export const canManageProducts = (user) => hasPermission(user, PERMISSIONS.MANAGE_PRODUCTS);
export const canManageBlogs = (user) => hasPermission(user, PERMISSIONS.MANAGE_BLOGS);
export const canManageEmailTemplates = (user) => hasPermission(user, PERMISSIONS.MANAGE_EMAIL_TEMPLATES);
export const canViewAnalytics = (user) => hasPermission(user, PERMISSIONS.VIEW_ANALYTICS);
