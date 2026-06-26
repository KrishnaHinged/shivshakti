/**
 * Central design tokens system mapping visual styles (Colors, Shadows, Radius, Durations).
 * These tokens align with Tailwind CSS theme configuration.
 */

export const COLORS = {
  // Brand colors
  brandBlue: "#1E3A8A",
  brandBlueLight: "#3B5FBB",
  brandBluePale: "rgba(30, 58, 138, 0.08)",
  brandOrange: "#F97316",
  brandOrangeLight: "#FB923C",
  brandOrangePale: "rgba(249, 115, 22, 0.10)",
  brandOrangeDark: "#F84502", // Legacy dark orange color

  // Dark Theme
  bgDark: "#120e0b",
  textPrimary: "#ffffff",
  textSecondary: "#d4c5b9",
  accent: "#eae1d8",
  accentDark: "#3a2c20",
  borderGlass: "rgba(255, 255, 255, 0.12)",
  bgGlass: "rgba(58, 44, 32, 0.45)",

  // Light Theme
  bgLight: "#fdfbf9",
  textLightPrimary: "#1c1511",
  textLightSecondary: "#5a4b41",
  borderLight: "rgba(90, 75, 65, 0.12)",
  cardBg: "#ffffff",
};

export const SHADOWS = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
  hover: "0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
};

export const DURATIONS = {
  fast: "150ms",
  normal: "300ms",
  slow: "500ms",
  autoRotate: 3000, // MS for config auto rotation timer
};

export const RADIUS = {
  none: "0px",
  sm: "0.125rem", // 2px
  md: "0.375rem", // 6px
  lg: "0.5rem",   // 8px
  xl: "0.75rem",  // 12px
  "2xl": "1rem",  // 16px
  "3xl": "1.5rem", // 24px
  pill: "9999px",
};
