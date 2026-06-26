import React from "react";

/**
 * Composable Card component system.
 * Rather than creating hierarchies of stat-cards, blog-cards, or image-cards,
 * features compose Card components.
 *
 * @param {Object} props
 * @param {"default" | "glass" | "outline"} [props.variant="default"] - Card style preset
 * @param {"lift" | "glow" | "none"} [props.hoverEffect="none"] - Interactive animation on hover
 * @param {string} [props.className=""] - Extra tailwind classes to merge
 */
export default function Card({
  children,
  variant = "default",
  hoverEffect = "none",
  className = "",
  ...rest
}) {
  const variantStyles = {
    default: "bg-white border border-[#5a4b41]/12 rounded-2xl shadow-sm text-[#1C1511]", // bg-card-bg / border-light / text-light-primary
    glass: "bg-[rgba(58,44,32,0.45)] backdrop-blur-md border border-[rgba(255,255,255,0.12)] rounded-2xl text-white", // bg-glass / border-glass
    outline: "bg-slate-50 border border-slate-100 rounded-xl text-slate-800",
  };

  const hoverStyles = {
    none: "",
    lift: "hover:-translate-y-1 hover:shadow-md transition-all duration-300",
    glow: "hover:border-brand-orange/30 hover:shadow-[0_0_20px_rgba(249,115,22,0.08)] transition-all duration-300",
  };

  const baseStyles = "overflow-hidden";

  const mergedClasses = [
    baseStyles,
    variantStyles[variant] || variantStyles.default,
    hoverStyles[hoverEffect] || hoverStyles.none,
    className
  ].join(" ").trim();

  return (
    <div className={mergedClasses} {...rest}>
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ children, className = "", ...rest }) {
  return (
    <div className={`px-6 py-4 border-b border-[#5a4b41]/12 flex items-center justify-between gap-4 ${className}`} {...rest}>
      {children}
    </div>
  );
};

Card.Body = function CardBody({ children, className = "", ...rest }) {
  return (
    <div className={`p-6 ${className}`} {...rest}>
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({ children, className = "", ...rest }) {
  return (
    <div className={`px-6 py-4 bg-slate-50/50 border-t border-[#5a4b41]/12 flex items-center justify-between gap-4 ${className}`} {...rest}>
      {children}
    </div>
  );
};
