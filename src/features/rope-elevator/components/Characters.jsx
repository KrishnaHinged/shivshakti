import React from "react";

/**
 * Characters component renders the blue and orange sketchy stick-figure
 * characters inside the elevator cabin SVG grid, including their sitting,
 * walking, running, and limb movement cycles.
 * 
 * @param {Object} props
 * @param {number} props.doorsOpenPercent
 * @param {number} props.blueX
 * @param {number} props.blueY
 * @param {number} props.orangeX
 * @param {number} props.orangeY
 * @param {string} props.animState
 * @param {number} props.walkTime
 */
export default function Characters({
  doorsOpenPercent,
  blueX,
  blueY,
  orangeX,
  orangeY,
  animState,
  walkTime,
}) {
  if (doorsOpenPercent <= 0) return null;

  return (
    <>
      {/* Blue Character */}
      <g
        transform={`translate(${blueX}, ${blueY}) ${animState === "running_in" ? "rotate(12)" : ""} scale(0.82)`}
        style={{
          transformOrigin: "20px 29px",
          transition: "none",
        }}
      >
        {/* Frizzy head (scribbled hand-drawn style) */}
        <circle cx="20" cy="13.5" r="4.2" stroke="#3B82F6" strokeWidth="1.2" fill="white" />
        <circle cx="20.3" cy="13.2" r="3.9" stroke="#3B82F6" strokeWidth="0.8" fill="none" opacity="0.8" />
        <circle cx="19.7" cy="13.7" r="4.0" stroke="#3B82F6" strokeWidth="0.8" fill="none" opacity="0.7" />

        {/* Sketchy scribbly curls inside the head */}
        <path
          d="M 18 11.5 Q 20 10.5 22 11.5 T 21 14.5 T 18 14 T 18.5 12"
          stroke="#3B82F6"
          strokeWidth="0.8"
          fill="none"
        />

        {/* Eyes - simple friendly dots */}
        <circle cx="18.5" cy="13.2" r="0.6" fill="white" />
        <circle cx="18.5" cy="13.2" r="0.3" fill="black" />
        <circle cx="21.5" cy="13.2" r="0.6" fill="white" />
        <circle cx="21.5" cy="13.2" r="0.3" fill="black" />

        {/* Smile */}
        <path d="M18.8 15.2 Q20 16.0 21.2 15.2" stroke="#3B82F6" strokeWidth="0.8" strokeLinecap="round" fill="none" />

        {/* Stick Torso */}
        <line x1="20" y1="17.7" x2="20" y2="29" stroke="#3B82F6" strokeWidth="1.6" strokeLinecap="round" />

        {/* Arms & Legs based on posture */}
        {doorsOpenPercent > 0 && animState === "outside" ? (
          // SITTING Posture
          <>
            {/* Left Arm resting on edge */}
            <path d="M 20 20.5 Q 16.5 21 14 26" stroke="#3B82F6" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            {/* Right Arm resting on lap */}
            <path d="M 20 20.5 Q 22 22 23 27" stroke="#3B82F6" strokeWidth="1.4" fill="none" strokeLinecap="round" />

            {/* Left Leg (Bent) */}
            <path d="M 20 29 L 14.5 29 L 14.5 36.5" stroke="#3B82F6" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {/* Right Leg (Bent) */}
            <path d="M 20 29 L 16.5 29 L 16.5 36.5" stroke="#3B82F6" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </>
        ) : animState === "running_in" ? (
          // RUNNING Posture (Leaning forward, arms bent and swinging fast, wide leg swing)
          <>
            {/* Left Arm (bent, running stance) */}
            <path d="M 20 20.5 Q 15 20 13 23.5" stroke="#3B82F6" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            {/* Right Arm (bent, running stance) */}
            <path d="M 20 20.5 Q 25 24 23 27.5" stroke="#3B82F6" strokeWidth="1.4" fill="none" strokeLinecap="round" />

            {/* Legs (wide running swings) */}
            <g style={{
              transform: `rotate(${walkTime > 0 ? 40 * Math.sin(walkTime * 0.45) : 0}deg)`,
              transformOrigin: "20px 29px"
            }}>
              <line x1="20" y1="29" x2="18.5" y2="35.3" stroke="#3B82F6" strokeWidth="1.6" strokeLinecap="round" />
            </g>
            <g style={{
              transform: `rotate(${walkTime > 0 ? -40 * Math.sin(walkTime * 0.45) : 0}deg)`,
              transformOrigin: "20px 29px"
            }}>
              <line x1="20" y1="29" x2="21.5" y2="35.3" stroke="#3B82F6" strokeWidth="1.6" strokeLinecap="round" />
            </g>
          </>
        ) : (
          // WALKING / STANDING Posture
          <>
            {/* Left Arm */}
            <line x1="20" y1="20.5" x2="16.5" y2="25.5" stroke="#3B82F6" strokeWidth="1.4" strokeLinecap="round" />
            {/* Right Arm */}
            <line x1="20" y1="20.5" x2="23.5" y2="25.5" stroke="#3B82F6" strokeWidth="1.4" strokeLinecap="round" />

            {/* Legs (animated swings) */}
            <g style={{
              transform: `rotate(${walkTime > 0 && blueX < 0 ? 22 * Math.sin(walkTime * 0.25) : 0}deg)`,
              transformOrigin: "20px 29px"
            }}>
              <line x1="20" y1="29" x2="18.5" y2="35.3" stroke="#3B82F6" strokeWidth="1.6" strokeLinecap="round" />
            </g>
            <g style={{
              transform: `rotate(${walkTime > 0 && blueX < 0 ? -22 * Math.sin(walkTime * 0.25) : 0}deg)`,
              transformOrigin: "20px 29px"
            }}>
              <line x1="20" y1="29" x2="21.5" y2="35.3" stroke="#3B82F6" strokeWidth="1.6" strokeLinecap="round" />
            </g>
          </>
        )}
      </g>

      {/* Orange Character */}
      <g
        transform={`translate(${orangeX}, ${orangeY}) ${animState === "running_in" ? "rotate(12)" : ""} scale(0.82)`}
        style={{
          transformOrigin: "30px 29px",
          transition: "none",
        }}
      >
        {/* Oval head (vertical ellipse) */}
        <ellipse cx="30" cy="13.5" rx="2.8" ry="4.2" stroke="#F97316" strokeWidth="1.2" fill="white" />
        <ellipse cx="29.8" cy="13.7" rx="2.5" ry="3.9" stroke="#F97316" strokeWidth="0.8" fill="none" opacity="0.8" />

        {/* Sketchy scribbly details inside the head */}
        <path
          d="M 29.5 11.5 Q 31 11 31.5 13.5 T 29 15"
          stroke="#F97316"
          strokeWidth="0.8"
          fill="none"
        />

        {/* Eyes - simple friendly dots */}
        <circle cx="28.5" cy="13.2" r="0.6" fill="white" />
        <circle cx="28.5" cy="13.2" r="0.3" fill="black" />
        <circle cx="31.5" cy="13.2" r="0.6" fill="white" />
        <circle cx="31.5" cy="13.2" r="0.3" fill="black" />

        {/* Smile */}
        <path d="M28.8 15.5 Q30 16.2 31.2 15.5" stroke="#F97316" strokeWidth="0.8" strokeLinecap="round" fill="none" />

        {/* Torso */}
        <line x1="30" y1="17.7" x2="30" y2="29" stroke="#F97316" strokeWidth="1.6" strokeLinecap="round" />

        {/* Arms & Legs based on posture */}
        {doorsOpenPercent > 0 && animState === "outside" ? (
          // SITTING Posture
          <>
            {/* Left Arm resting on lap */}
            <path d="M 30 20.5 Q 26.5 21 24 26" stroke="#F97316" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            {/* Right Arm resting on lap */}
            <path d="M 30 20.5 Q 32 22 33 27" stroke="#F97316" strokeWidth="1.4" fill="none" strokeLinecap="round" />

            {/* Left Leg (Bent) */}
            <path d="M 30 29 L 24.5 29 L 24.5 36.5" stroke="#F97316" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {/* Right Leg (Bent) */}
            <path d="M 30 29 L 26.5 29 L 26.5 36.5" stroke="#F97316" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </>
        ) : animState === "running_in" ? (
          // RUNNING Posture (Leaning forward, arms bent and swinging fast, wide leg swing)
          <>
            {/* Left Arm (bent, running stance) */}
            <path d="M 30 20.5 Q 25 20 23 23.5" stroke="#F97316" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            {/* Right Arm (bent, running stance) */}
            <path d="M 30 20.5 Q 35 24 33 27.5" stroke="#F97316" strokeWidth="1.4" fill="none" strokeLinecap="round" />

            {/* Legs (wide running swings) */}
            <g style={{
              transform: `rotate(${walkTime > 0 ? 40 * Math.sin(walkTime * 0.45 + 0.5) : 0}deg)`,
              transformOrigin: "30px 29px"
            }}>
              <line x1="30" y1="29" x2="28.5" y2="35.3" stroke="#F97316" strokeWidth="1.6" strokeLinecap="round" />
            </g>
            <g style={{
              transform: `rotate(${walkTime > 0 ? -40 * Math.sin(walkTime * 0.45 + 0.5) : 0}deg)`,
              transformOrigin: "30px 29px"
            }}>
              <line x1="30" y1="29" x2="31.5" y2="35.3" stroke="#F97316" strokeWidth="1.6" strokeLinecap="round" />
            </g>
          </>
        ) : (
          // WALKING / STANDING Posture
          <>
            {/* Left Arm */}
            <line x1="30" y1="20.5" x2="26.5" y2="25.5" stroke="#F97316" strokeWidth="1.4" strokeLinecap="round" />
            {/* Right Arm */}
            <line x1="30" y1="20.5" x2="33.5" y2="25.5" stroke="#F97316" strokeWidth="1.4" strokeLinecap="round" />

            {/* Legs (animated swings) */}
            <g style={{
              transform: `rotate(${walkTime > 0 && orangeX < 0 ? 22 * Math.sin(walkTime * 0.25 + 0.5) : 0}deg)`,
              transformOrigin: "30px 29px"
            }}>
              <line x1="30" y1="29" x2="28.5" y2="35.3" stroke="#F97316" strokeWidth="1.6" strokeLinecap="round" />
            </g>
            <g style={{
              transform: `rotate(${walkTime > 0 && orangeX < 0 ? -22 * Math.sin(walkTime * 0.25 + 0.5) : 0}deg)`,
              transformOrigin: "30px 29px"
            }}>
              <line x1="30" y1="29" x2="31.5" y2="35.3" stroke="#F97316" strokeWidth="1.6" strokeLinecap="round" />
            </g>
          </>
        )}
      </g>
    </>
  );
}
