import React from "react";

/**
 * Cable component renders the Guide track ticks, Wire rope cable, 
 * braided texture patterns, and shadow overlays in the canvas track.
 * 
 * @param {Object} props
 * @param {Object} props.coords - startX, startY, endY
 * @param {number} props.currentRopeLength - height calculated with bounces
 * @param {boolean} props.isMobile
 * @param {number} props.totalHeight
 */
export default function Cable({ coords, currentRopeLength, isMobile, totalHeight }) {
  if (coords.startX <= 0 || currentRopeLength <= 0) return null;

  return (
    <svg className="absolute inset-0 w-full h-full">
      <defs>
        {/* Metallic Steel Cable Gradient */}
        <linearGradient id="cableGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1c1d22" />
          <stop offset="25%" stopColor="#3b424f" />
          <stop offset="50%" stopColor="#8c97a5" />
          <stop offset="65%" stopColor="#4c5463" />
          <stop offset="100%" stopColor="#15171c" />
        </linearGradient>

        {/* Core Steel Wire Texture Overlay */}
        <pattern id="cableTexture" width="4" height="8" patternUnits="userSpaceOnUse">
          <path
            d="M0 0 L4 4 M0 4 L4 8"
            fill="none"
            stroke="#0b0d10"
            strokeWidth="1.2"
            opacity="0.5"
          />
        </pattern>

        {/* Cable Guide Rail pattern */}
        <pattern id="guideRailTicks" width="10" height="40" patternUnits="userSpaceOnUse">
          <line x1="0" y1="20" x2="8" y2="20" stroke="#cbd5e1" strokeWidth="1" opacity="0.12" />
        </pattern>

        {/* Sleek drop shadow for the cable and guide tracks */}
        <filter id="cableShadow" x="-20%" y="-10%" width="140%" height="120%">
          <feDropShadow dx="-1.5" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Guide Rail Ticks / Ruler marks */}
      <rect
        x={coords.startX - 22}
        y={coords.startY}
        width="8"
        height={totalHeight}
        fill="url(#guideRailTicks)"
      />

      {/* Cable Shadow Backing */}
      <line
        x1={coords.startX + 1}
        y1={coords.startY}
        x2={coords.startX + 1}
        y2={coords.startY + currentRopeLength}
        stroke="#000"
        strokeWidth={isMobile ? 2.5 : 4}
        opacity="0.25"
        filter="blur(1.5px)"
      />

      {/* Base Metal Wire Rope Cable */}
      <line
        x1={coords.startX}
        y1={coords.startY}
        x2={coords.startX}
        y2={coords.startY + currentRopeLength}
        stroke="url(#cableGradient)"
        strokeWidth={isMobile ? 2.5 : 4}
        strokeLinecap="round"
      />

      {/* Braided Texture Overlay */}
      <line
        x1={coords.startX}
        y1={coords.startY}
        x2={coords.startX}
        y2={coords.startY + currentRopeLength}
        stroke="url(#cableTexture)"
        strokeWidth={isMobile ? 2.5 : 4}
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
}
