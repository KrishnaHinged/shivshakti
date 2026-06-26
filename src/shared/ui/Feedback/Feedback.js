import React from "react";
import { Loader2, Inbox } from "lucide-react";

/**
 * Standard SVG loading spinner component.
 *
 * @param {Object} props
 * @param {"brand-orange" | "brand-blue" | "white" | "slate"} [props.color="brand-orange"] - Spinner color theme
 * @param {"sm" | "md" | "lg"} [props.size="md"] - Sizing options
 * @param {string} [props.className=""] - Extra tailwind classes
 */
export function Spinner({
  color = "brand-orange",
  size = "md",
  className = "",
  ...rest
}) {
  const colorClasses = {
    "brand-orange": "text-brand-orange",
    "brand-blue": "text-brand-blue",
    white: "text-white",
    slate: "text-slate-400",
  };

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <Loader2
      className={`animate-spin ${colorClasses[color]} ${sizeClasses[size]} ${className}`}
      {...rest}
    />
  );
}

/**
 * Standard Loading Skeleton block.
 *
 * @param {Object} props
 * @param {"rect" | "circle"} [props.variant="rect"] - Visual shape
 * @param {string} [props.width="100%"] - Element width
 * @param {string} [props.height="1rem"] - Element height
 * @param {string} [props.className=""] - Extra tailwind classes
 */
export function Skeleton({
  variant = "rect",
  width,
  height,
  className = "",
  ...rest
}) {
  const variantClasses = variant === "circle" ? "rounded-full" : "rounded-lg";

  return (
    <div
      className={`animate-pulse bg-slate-200/80 ${variantClasses} ${className}`}
      style={{ width, height }}
      {...rest}
    />
  );
}

/**
 * Standardized Empty State placeholder.
 *
 * @param {Object} props
 * @param {string} props.title - Main header message
 * @param {string} [props.description] - Supporting text description
 * @param {React.ReactNode} [props.icon] - React icon node to display
 * @param {React.ReactNode} [props.action] - Optional button action elements
 * @param {string} [props.className=""] - Extra container classes
 */
export function EmptyState({
  title,
  description,
  icon,
  action,
  className = "",
  ...rest
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50/50 ${className}`}
      {...rest}
    >
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
        {icon || <Inbox className="w-6 h-6" />}
      </div>
      <h3 className="text-sm font-bold text-slate-800 mb-1">{title}</h3>
      {description && (
        <p className="text-xs text-slate-500 max-w-sm mb-4">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
