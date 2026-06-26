import React from "react";
import { Loader2 } from "lucide-react";

/**
 * Unified, composable Button component system.
 * Replaces ad-hoc styled button declarations across the project.
 *
 * @param {Object} props
 * @param {"primary" | "secondary" | "outline" | "ghost" | "danger"} [props.variant="primary"] - Visual style variant
 * @param {"sm" | "md" | "lg"} [props.size="md"] - Padding and typography size
 * @param {"xl" | "full" | "lg" | "md" | "none"} [props.radius="xl"] - Rounded border radius
 * @param {boolean} [props.loading=false] - If true, disables the button and displays a spinner
 * @param {React.ReactNode} [props.icon] - Optional icon component to display
 * @param {"left" | "right"} [props.iconPosition="left"] - Position of the icon relative to children
 * @param {boolean} [props.disabled=false] - Standard disabled state
 * @param {string} [props.className=""] - Extra tailwind classes to merge
 * @param {string} [props.type="button"] - HTML button type attribute
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  radius = "xl",
  loading = false,
  icon,
  iconPosition = "left",
  disabled = false,
  className = "",
  type = "button",
  ...rest
}) {
  // Variant styling classes mapping
  const variantStyles = {
    primary: "bg-brand-orange text-white hover:bg-[#FB923C] shadow-sm active:translate-y-0.5", // brand-orange-light on hover
    secondary: "bg-[#1E3A8A] text-white hover:bg-[#3B5FBB] shadow-sm", // brand-blue and brand-blue-light
    outline: "bg-slate-50 border border-slate-200 hover:border-brand-orange hover:bg-brand-orange-pale/10 hover:text-brand-orange text-slate-600",
    ghost: "bg-[#1E3A8A]/10 text-[#1E3A8A] hover:bg-[#1E3A8A]/20",
    danger: "bg-red-600 text-white hover:bg-red-500 shadow-sm",
  };

  // Size styling classes mapping
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs font-semibold uppercase tracking-wider",
    md: "px-5 py-2.5 text-xs font-bold uppercase tracking-wider",
    lg: "px-6 py-3.5 text-[0.9rem] font-semibold",
  };

  // Radius styling classes mapping
  const radiusStyles = {
    none: "rounded-none",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  };

  const baseStyles = "inline-flex items-center justify-center gap-1.5 transition duration-300 select-none cursor-pointer disabled:opacity-50 disabled:pointer-events-none";

  const mergedClasses = [
    baseStyles,
    variantStyles[variant] || variantStyles.primary,
    sizeStyles[size] || sizeStyles.md,
    radiusStyles[radius] || radiusStyles.xl,
    className
  ].join(" ").trim();

  return (
    <button
      type={type}
      className={mergedClasses}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
      ) : (
        icon && iconPosition === "left" && <span className="shrink-0">{icon}</span>
      )}
      
      {children && <span>{children}</span>}
      
      {!loading && icon && iconPosition === "right" && (
        <span className="shrink-0">{icon}</span>
      )}
    </button>
  );
}
