"use client";

import React, { useEffect, useRef, useState } from "react";

export const RopeElevator = () => {
  const containerRef = useRef(null);
  const requestRef = useRef(null);
  const scrollYRef = useRef(0);
  const touchStartRef = useRef(0);

  // Layout positions
  const [coords, setCoords] = useState({ startX: 0, startY: 0, endY: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Animation states
  const [hasDeployed, setHasDeployed] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [ropeHeightPercent, setRopeHeightPercent] = useState(0); // 0 to 1 during drop
  const [ropeBounce, setRopeBounce] = useState(0); // For elastic settling bounce

  // Ref tracking for requestAnimationFrame loops
  const physicsRef = useRef({
    currentY: 0,
    targetY: 0,
    velocity: 0,
    sway: 0,
    time: 0,
    reducedMotion: false,
  });

  // Calculate coordinates on resize/load (avoiding reflows during scroll)
  const calculateCoordinates = () => {
    const heroEl = document.getElementById("home");
    const footerEl = document.getElementById("footer");

    if (!heroEl || !footerEl) return;

    const heroRect = heroEl.getBoundingClientRect();
    const footerRect = footerEl.getBoundingClientRect();

    const currentScrollY = window.scrollY;
    const currentScrollX = window.scrollX;

    const heroBottomDoc = heroRect.bottom + currentScrollY;
    const footerTopDoc = footerRect.top + currentScrollY;

    // Aligned to the right margin of the page containers
    let margin = 40;
    if (window.innerWidth < 768) {
      margin = 15;
    } else if (window.innerWidth < 1024) {
      margin = 25;
    }

    const startX = heroRect.right + currentScrollX - margin;

    setCoords({
      startX,
      startY: heroBottomDoc - 5,
      endY: footerTopDoc + 5,
    });
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    physicsRef.current.reducedMotion = mediaQuery.matches;

    calculateCoordinates();
    window.addEventListener("load", calculateCoordinates);
    window.addEventListener("resize", calculateCoordinates);

    const checkSizes = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    checkSizes();
    window.addEventListener("resize", checkSizes);

    // Dynamic layout sync double-check
    const timer = setTimeout(calculateCoordinates, 1500);

    // Session status check
    const hasRun = sessionStorage.getItem("shivshakti-rope-deployed");
    if (hasRun === "true" || physicsRef.current.reducedMotion) {
      setHasDeployed(true);
      setRopeHeightPercent(1);
    }

    return () => {
      window.removeEventListener("load", calculateCoordinates);
      window.removeEventListener("resize", calculateCoordinates);
      window.removeEventListener("resize", checkSizes);
      clearTimeout(timer);
    };
  }, []);

  // Track window scroll coordinates natively using passive scroll events
  useEffect(() => {
    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    scrollYRef.current = window.scrollY;
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intercept and slow down/dampen scrolling during rope deployment
  useEffect(() => {
    if (!isDeploying) return;

    const handleWheel = (e) => {
      e.preventDefault();
      // Apply 15% scroll speed dampening
      window.scrollBy({
        top: e.deltaY * 0.15,
        behavior: "instant",
      });
    };

    const handleTouchStart = (e) => {
      if (e.touches.length > 0) {
        touchStartRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        e.preventDefault();
        const currentY = e.touches[0].clientY;
        const deltaY = touchStartRef.current - currentY;
        touchStartRef.current = currentY;
        // Apply touch dragging friction (30%)
        window.scrollBy({
          top: deltaY * 0.3,
          behavior: "instant",
        });
      }
    };

    // Add active listener blocking default scroll progression
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isDeploying]);

  // Scroll trigger check: activates the deployment when scrolling past the Hero
  useEffect(() => {
    if (hasDeployed || isDeploying) return;

    const triggerCheck = () => {
      const heroEl = document.getElementById("home");
      if (!heroEl) return;

      const heroRect = heroEl.getBoundingClientRect();
      // Deploy when the bottom of the Hero section enters viewport center
      if (heroRect.bottom < window.innerHeight * 0.75) {
        window.removeEventListener("scroll", triggerCheck);
        startDeployment();
      }
    };

    window.addEventListener("scroll", triggerCheck);
    return () => window.removeEventListener("scroll", triggerCheck);
  }, [hasDeployed, isDeploying]);

  const startDeployment = () => {
    setIsDeploying(true);

    let startTime = null;
    const duration = 1800; // Cinematic animation: 1.8 seconds

    const animateRope = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / 1300, 1); // Extends downward over 1.3 seconds

      // Dynamic elastic drop easing
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress) * Math.cos((progress * 2.5 - 0.75) * Math.PI);
      setRopeHeightPercent(easeProgress);

      // Bounce and settle effect at the end of the drop (1.3s to 1.8s)
      if (elapsed > 1300) {
        const settleProgress = (elapsed - 1300) / 500;
        const bounce = Math.sin(settleProgress * Math.PI * 6) * Math.pow(1 - settleProgress, 2.5) * 12;
        setRopeBounce(bounce);
      }

      if (elapsed < duration) {
        requestRef.current = requestAnimationFrame(animateRope);
      } else {
        // Drop sequence finished, activate normal scrolling
        setRopeHeightPercent(1);
        setRopeBounce(0);
        setHasDeployed(true);
        setIsDeploying(false);
        sessionStorage.setItem("shivshakti-rope-deployed", "true");
      }
    };

    requestRef.current = requestAnimationFrame(animateRope);
  };

  // 60FPS physics loop for elevator movement, cable tension, and rotation sways
  useEffect(() => {
    if (!hasDeployed) return;

    physicsRef.current.currentY = coords.startY;
    physicsRef.current.targetY = coords.startY;

    const renderLoop = () => {
      const scrollY = scrollYRef.current;
      const viewportHeight = window.innerHeight;

      const travelStart = coords.startY;
      const travelEnd = coords.endY;
      const totalDist = travelEnd - travelStart;

      if (totalDist <= 0) {
        requestRef.current = requestAnimationFrame(renderLoop);
        return;
      }

      // Calculate elevator viewport-centered Y coordinate (lerp target)
      const cabinHeight = isMobile ? 44 : isTablet ? 55 : 65;
      const targetY = Math.max(
        coords.startY,
        Math.min(scrollY + viewportHeight / 2 - cabinHeight / 2, coords.endY)
      );

      physicsRef.current.targetY = targetY;

      // Ease positioning with linear interpolation (lerp factor 0.08)
      const diffY = targetY - physicsRef.current.currentY;
      physicsRef.current.currentY += diffY * 0.08;

      // Update dynamics metrics
      physicsRef.current.velocity = diffY;
      physicsRef.current.time += 1;

      // Enhance sway physics:
      // 1. Natural slow pendulum sway
      const pendulum = Math.sin(physicsRef.current.time * 0.02) * 0.8;
      // 2. Velocity-driven inertia (sways when the elevator accelerates/stops)
      const velocitySway = Math.sin(physicsRef.current.time * 0.12) * (physicsRef.current.velocity * 0.05);
      // 3. Tension vibration: high-frequency shudder when moving fast
      const tensionVibe = Math.abs(physicsRef.current.velocity) > 1.5
        ? Math.sin(physicsRef.current.time * 0.6) * 0.3
        : 0;

      const totalSway = pendulum + velocitySway + tensionVibe;
      physicsRef.current.sway = totalSway;

      // Safe rotational tilt constraint: max +/- 3 degrees
      const tilt = Math.max(-3, Math.min(3, totalSway * 0.6));

      // Direct DOM manipulation avoiding React re-render lags
      const liftEl = document.getElementById("rope-elevator-lift");
      const progressLineEl = document.getElementById("rope-progress-indicator-line");

      if (liftEl) {
        liftEl.style.transform = `translate3d(calc(${coords.startX}px - 50%), ${physicsRef.current.currentY}px, 0) rotate(${tilt}deg)`;
      }

      if (progressLineEl) {
        const progressDist = physicsRef.current.currentY - coords.startY;
        progressLineEl.setAttribute("y2", coords.startY + progressDist);
      }

      requestRef.current = requestAnimationFrame(renderLoop);
    };

    requestRef.current = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(requestRef.current);
  }, [hasDeployed, coords.startX, coords.startY, coords.endY, isMobile, isTablet]);

  const totalHeight = coords.endY - coords.startY;
  const currentRopeLength = totalHeight * ropeHeightPercent + ropeBounce;

  // Responsive sizes
  const liftWidth = isMobile ? 36 : isTablet ? 46 : 54;
  const liftHeight = isMobile ? 44 : isTablet ? 55 : 65;

  if (coords.endY <= coords.startY) return null;

  return (
    <>
      {/* Rope Track and Guide Systems (Always behind content) */}
      <div
        ref={containerRef}
        className="absolute top-0 left-0 w-full pointer-events-none select-none z-[-1]"
        style={{ height: `${coords.endY + 200}px` }}
      >
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

          {/* Rope Track and Guide Systems */}
          {coords.startX > 0 && currentRopeLength > 0 && (
            <>
              {/* Guide Rail (Vertical steel track next to the rope) */}
              {/* <line
                x1={coords.startX - 18}
                y1={coords.startY}
                x2={coords.startX - 18}
                y2={coords.endY}
                stroke="#94a3b8"
                strokeWidth="1.5"
                opacity="0.15"
              /> */}
              {/* Guide Rail Ticks / Ruler marks */}
              <rect
                x={coords.startX - 22}
                y={coords.startY}
                width="8"
                height={totalHeight}
                fill="url(#guideRailTicks)"
              />

              {/* Glowing active progress line trailing the elevator */}
              {/* <line
                id="rope-progress-indicator-line"
                x1={coords.startX - 18}
                y1={coords.startY}
                x2={coords.startX - 18}
                y2={coords.startY}
                stroke="#ff6b00"
                strokeWidth="2"
                opacity="0.65"
                strokeLinecap="round"
              /> */}

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
            </>
          )}
        </svg>
      </div>

      {/* Lift Cabin (Rendered on top of backgrounds/footer, but pointer-events-none) */}
      {hasDeployed && (
        <div
          className="absolute top-0 left-0 w-full pointer-events-none select-none z-30"
          style={{ height: `${coords.endY + 200}px` }}
        >
          <div
            id="rope-elevator-lift"
            className="absolute top-0 left-0 will-change-transform"
            style={{
              width: `${liftWidth}px`,
              height: `${liftHeight}px`,
              transform: `translate3d(calc(${coords.startX}px - 50%), ${coords.startY}px, 0)`,
            }}
          >
            {/* Detailed premium elevator model */}
            <svg
              viewBox="0 0 50 60"
              className="w-full h-full drop-shadow-[0_6px_14px_rgba(0,0,0,0.5)]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer steel frame */}
              <rect x="2" y="6" width="46" height="51" rx="3.5" fill="#141518" stroke="#333a45" strokeWidth="2" />

              {/* Top pulleys and suspension hook */}
              <path d="M17 6 L21 2 L29 2 L33 6 Z" fill="#2d333f" />
              <circle cx="25" cy="4" r="1.5" fill="#e2e8f0" />
              <circle cx="25" cy="4" r="0.5" fill="#ff6b00" />

              {/* Top cable attachment loop details */}
              <line x1="25" y1="0" x2="25" y2="2" stroke="#475569" strokeWidth="1" />

              {/* Outer framework design details */}
              <line x1="2" y1="20" x2="48" y2="20" stroke="#232730" strokeWidth="1.5" />
              <line x1="2" y1="45" x2="48" y2="45" stroke="#232730" strokeWidth="1.5" />

              {/* Glowing Internal Cabin Light (Warm orange elevator glow) */}
              <rect x="5" y="9" width="40" height="34" rx="2" fill="#ff6b00" fillOpacity="0.06" />

              {/* Elevator split doors / Windows */}
              <rect x="6" y="10" width="17" height="32" rx="1.5" fill="#191a1e" stroke="#2c323d" strokeWidth="1.5" />
              <rect x="27" y="10" width="17" height="32" rx="1.5" fill="#191a1e" stroke="#2c323d" strokeWidth="1.5" />

              {/* Inner elevator structure outline */}
              <line x1="14.5" y1="10" x2="14.5" y2="42" stroke="#ff6b00" strokeWidth="0.8" opacity="0.35" />
              <line x1="35.5" y1="10" x2="35.5" y2="42" stroke="#ff6b00" strokeWidth="0.8" opacity="0.35" />

              {/* Glass panels shine lines */}
              <path d="M7 22 L15 11 M28 22 L36 11" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
              <path d="M10 32 L19 21 M31 32 L40 21" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

              {/* Safety mesh grille / lower panels */}
              <rect x="5" y="46" width="40" height="8" fill="#0f1013" rx="1" />
              <line x1="10" y1="46" x2="10" y2="54" stroke="#262c37" strokeWidth="1.2" />
              <line x1="18" y1="46" x2="18" y2="54" stroke="#262c37" strokeWidth="1.2" />
              <line x1="26" y1="46" x2="26" y2="54" stroke="#262c37" strokeWidth="1.2" />
              <line x1="34" y1="46" x2="34" y2="54" stroke="#262c37" strokeWidth="1.2" />
              <line x1="42" y1="46" x2="42" y2="54" stroke="#262c37" strokeWidth="1.2" />

              {/* Tiny modern details (Elevator control display indicator) */}
              <rect x="23" y="13" width="4" height="3" fill="#ff6b00" rx="0.5" opacity="0.85" />
            </svg>
          </div>
        </div>
      )}
    </>
  );
};

export default RopeElevator;
