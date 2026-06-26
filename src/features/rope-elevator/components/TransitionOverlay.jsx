import React from "react";

/**
 * TransitionOverlay component handles rendering the cinematic modal transition 
 * overlay and fullscreen progress load indicators when route changes occur.
 * 
 * @param {Object} props
 * @param {string} props.transitionState - 'idle' | 'focusing' | 'opening' | 'expanding'
 * @param {Object} props.startRect - cabin coordinates rectangle
 * @param {number} props.liftWidth
 * @param {number} props.liftHeight
 */
export default function TransitionOverlay({
  transitionState,
  startRect,
  liftWidth,
  liftHeight,
}) {
  if (transitionState === "idle" || !startRect) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999] select-none">
      {/* Cabin container located exactly at its scroll position, z-lifted to top layer */}
      <div
        className="will-change-transform"
        style={{
          position: "fixed",
          top: `${startRect.top}px`,
          left: `${startRect.left}px`,
          width: `${liftWidth}px`,
          height: `${liftHeight}px`,
        }}
      >
        {/* Detailed premium elevator model */}
        <svg
          viewBox="0 0 50 60"
          preserveAspectRatio="none"
          className="w-full h-full drop-shadow-[0_12px_28px_rgba(0,0,0,0.6)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer steel frame */}
          <rect x="2" y="6" width="46" height="51" rx="3.5" fill="#0A0A0A" stroke="#FFFFFF" strokeWidth="2.5" />

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
          <line x1="2" y1="20" x2="48" y2="20" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" />
          <line x1="2" y1="45" x2="48" y2="45" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" />

          {/* Glowing Internal Cabin Light — matches loading screen dark theme */}
          <rect
            x="5"
            y="9"
            width="40"
            height="34"
            rx="2"
            fill="#0A0A0A"
            style={{
              fillOpacity: (transitionState === "opening" || transitionState === "expanding") ? 1 : 0.06,
              transition: "all 0.4s ease-in-out",
            }}
          />
          
          {/* Orange accent glow inside cabin when doors open */}
          <rect
            x="5"
            y="9"
            width="40"
            height="34"
            rx="2"
            fill="#F97316"
            style={{
              fillOpacity: (transitionState === "opening" || transitionState === "expanding") ? 0.15 : 0,
              filter: (transitionState === "opening" || transitionState === "expanding") ? "drop-shadow(0 0 8px rgba(249,115,22,0.6))" : "none",
              transition: "all 0.5s ease-in-out",
            }}
          />

          {/* Elevator split doors / Windows — bouncy easing */}
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
              transform: (transitionState === "opening" || transitionState === "expanding") ? "translateX(-14px)" : "none",
              transition: "transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          />
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
              transform: (transitionState === "opening" || transitionState === "expanding") ? "translateX(14px)" : "none",
              transition: "transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          />

          {/* Inner elevator structure outline */}
          <line x1="14.5" y1="10" x2="14.5" y2="42" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <line x1="35.5" y1="10" x2="35.5" y2="42" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

          {/* Glass panels shine lines */}
          <path d="M7 22 L15 11 M28 22 L36 11" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
          <path d="M10 32 L19 21 M31 32 L40 21" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

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
      </div>

      {/* Loading screen style expanding dark glow, anchored at the cabin center */}
      <div
        className="fixed rounded-full pointer-events-none z-[99998]"
        style={{
          top: `${startRect.top + liftHeight / 2}px`,
          left: `${startRect.left + liftWidth / 2}px`,
          width: "20px",
          height: "20px",
          background: "radial-gradient(circle, #0A0A0A 60%, rgba(30,58,138,0.4) 100%)",
          boxShadow: "0 0 60px 30px rgba(10,10,10,0.8)",
          transform: transitionState === "expanding"
            ? "translate(-50%, -50%) scale(500)"
            : "translate(-50%, -50%) scale(0)",
          opacity: transitionState === "expanding" ? 1 : 0,
          transition: "transform 0.7s cubic-bezier(0.34, 1.3, 0.64, 1), opacity 0.3s ease-out",
        }}
      />

      {/* Full-screen loading screen overlay — appears after glow expands */}
      <div
        className="fixed inset-0 pointer-events-none z-[99999] flex flex-col items-center justify-center"
        style={{
          background: "radial-gradient(circle at 15% 20%, rgba(30,58,138,0.25) 0%, transparent 50%), radial-gradient(circle at 85% 80%, rgba(249,115,22,0.15) 0%, transparent 45%), #0A0A0A",
          opacity: transitionState === "expanding" ? 1 : 0,
          transition: "opacity 0.4s ease-out",
          transitionDelay: "280ms",
        }}
      >
        {/* Mini loading screen animation content */}
        <div style={{
          opacity: transitionState === "expanding" ? 1 : 0,
          transform: transitionState === "expanding" ? "scale(1) translateY(0)" : "scale(0.8) translateY(20px)",
          transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          transitionDelay: "450ms",
        }}>
          <svg
            width="120"
            height="170"
            viewBox="0 0 180 260"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-hidden"
          >
            {/* Shaft outline */}
            <rect x="10" y="10" width="160" height="240" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" fill="none" />
            
            {/* Guide rails */}
            <line x1="25" y1="10" x2="25" y2="250" stroke="#1E3A8A" strokeWidth="3" />
            <line x1="155" y1="10" x2="155" y2="250" stroke="#1E3A8A" strokeWidth="3" />
            
            {/* Cabin */}
            <g>
              <line x1="70" y1="10" x2="70" y2="82" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
              <line x1="90" y1="10" x2="90" y2="82" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
              <line x1="110" y1="10" x2="110" y2="82" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
              <rect x="30" y="80" width="120" height="140" stroke="#FFFFFF" strokeWidth="2.5" fill="rgba(255,255,255,0.03)" />
              <line x1="70" y1="85" x2="70" y2="215" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <line x1="110" y1="85" x2="110" y2="215" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <line x1="90" y1="85" x2="90" y2="215" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
              <line x1="20" y1="82" x2="160" y2="82" stroke="#F97316" strokeWidth="3" />
              <line x1="20" y1="218" x2="160" y2="218" stroke="#F97316" strokeWidth="3" />
              
              {/* Floor indicator */}
              <rect x="70" y="65" width="40" height="14" fill="rgba(30,58,138,0.3)" stroke="#1E3A8A" strokeWidth="1" rx="3" />
            </g>
          </svg>

          {/* Progress bar */}
          <div style={{
            width: "120px",
            height: "2px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "2px",
            marginTop: "16px",
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              borderRadius: "2px",
              background: "linear-gradient(90deg, #1E3A8A 0%, #F97316 100%)",
              animation: transitionState === "expanding" ? "elevator-transition-progress 1.5s linear forwards" : "none",
              width: "0%",
            }} />
          </div>

          {/* Status text */}
          <div style={{
            fontSize: "10px",
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            textAlign: "center",
            marginTop: "10px",
          }}>
            Loading products...
          </div>
        </div>

        {/* Inline keyframe for the progress bar */}
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes elevator-transition-progress {
            from { width: 0%; }
            to { width: 100%; }
          }
        `}} />
      </div>
    </div>
  );
}
