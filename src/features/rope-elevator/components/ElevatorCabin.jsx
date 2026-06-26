import React from "react";
import ElevatorDoors from "./ElevatorDoors";
import Characters from "./Characters";

/**
 * ElevatorCabin component renders the outer frame structure, glows, pulleys,
 * and nests the split doors and characters SVGs.
 * 
 * @param {Object} props
 * @param {boolean} props.isMobile
 * @param {boolean} props.isTablet
 * @param {number} props.doorsOpenPercent
 * @param {number} props.blueX
 * @param {number} props.blueY
 * @param {number} props.orangeX
 * @param {number} props.orangeY
 * @param {string} props.animState
 * @param {number} props.walkTime
 */
export default function ElevatorCabin({
  isMobile,
  isTablet,
  doorsOpenPercent,
  blueX,
  blueY,
  orangeX,
  orangeY,
  animState,
  walkTime,
}) {
  return (
    <svg
      viewBox="0 0 50 60"
      preserveAspectRatio="none"
      className="w-full h-full drop-shadow-[0_6px_14px_rgba(0,0,0,0.5)] overflow-visible"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer steel frame */}
      <rect x="2" y="6" width="46" height="51" rx="3.5" fill="#1b1824ff" stroke="#FFFFFF" strokeWidth="2.5" />

      {/* Top and Bottom beams */}
      <line x1="3" y1="6.5" x2="47" y2="6.5" stroke="#F97316" strokeWidth="3" strokeLinecap="round" />
      <line x1="3" y1="56.5" x2="47" y2="56.5" stroke="#F97316" strokeWidth="3" strokeLinecap="round" />

      {/* Top pulleys and suspension hook */}
      <path d="M17 6 L21 2 L29 2 L33 6 Z" fill="#2d333f" />
      <circle cx="25" cy="4" r="1.5" fill="#e2e8f0" />
      <circle cx="25" cy="4" r="0.5" fill="#F97316" />

      {/* Top cable attachment loop details */}
      <line x1="25" y1="0" x2="25" y2="2" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />

      {/* Outer framework design details */}
      <line x1="2" y1="20" x2="48" y2="20" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <line x1="2" y1="45" x2="48" y2="45" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

      {/* Glowing Internal Cabin Light (Warm orange elevator glow) */}
      <rect x="5" y="9" width="40" height="34" rx="2" fill="#F97316" fillOpacity="0.06" />

      {/* Embedded Characters */}
      <Characters
        doorsOpenPercent={doorsOpenPercent}
        blueX={blueX}
        blueY={blueY}
        orangeX={orangeX}
        orangeY={orangeY}
        animState={animState}
        walkTime={walkTime}
      />

      {/* Embedded Doors */}
      <ElevatorDoors doorsOpenPercent={doorsOpenPercent} />

      {/* Safety mesh grille / lower panels */}
      <rect x="5" y="46" width="40" height="8" fill="#0f1013" rx="1" />
      <line x1="10" y1="46" x2="10" y2="54" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" />
      <line x1="18" y1="46" x2="18" y2="54" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" />
      <line x1="26" y1="46" x2="26" y2="54" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" />
      <line x1="34" y1="46" x2="34" y2="54" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" />
      <line x1="42" y1="46" x2="42" y2="54" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" />

      {/* Tiny modern details (Elevator control display indicator) */}
      <rect x="23" y="13" width="4" height="3" fill="#F97316" rx="0.5" opacity="0.85" />
    </svg>
  );
}
