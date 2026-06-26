import React from "react";

/**
 * ElevatorDoors component renders the sliding doors, window frame outlines, 
 * and glass shine panels inside the elevator cabin SVG grid.
 * 
 * @param {Object} props
 * @param {number} props.doorsOpenPercent - ratio from 0 (closed) to 1 (open)
 */
export default function ElevatorDoors({ doorsOpenPercent }) {
  return (
    <>
      {/* Left split door panel */}
      <rect
        x="6"
        y="10"
        width="17"
        height="32"
        rx="1.5"
        fill="#0A1128"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1.5"
        style={{
          transform: `translateX(${-13.5 * doorsOpenPercent}px)`,
          transition: "none",
        }}
      />
      
      {/* Right split door panel */}
      <rect
        x="27"
        y="10"
        width="17"
        height="32"
        rx="1.5"
        fill="#0A1128"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1.5"
        style={{
          transform: `translateX(${13.5 * doorsOpenPercent}px)`,
          transition: "none",
        }}
      />

      {/* Inner framework structural details */}
      <line x1="14.5" y1="10" x2="14.5" y2="42" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <line x1="35.5" y1="10" x2="35.5" y2="42" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

      {/* Glass window shine panels */}
      <path d="M7 22 L15 11 M28 22 L36 11" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
      <path d="M10 32 L19 21 M31 32 L40 21" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
    </>
  );
}
