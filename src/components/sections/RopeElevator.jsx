"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export const RopeElevator = () => {
  const containerRef = useRef(null);
  const requestRef = useRef(null);
  const scrollYRef = useRef(0);
  const touchStartRef = useRef(0);
  const skipEasingRef = useRef(false);
  const taggedElementRef = useRef(null);

  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isAbout = pathname === "/about";

  // Layout positions
  const [coords, setCoords] = useState({ startX: 0, startY: 0, endY: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Animation states
  const [hasDeployed, setHasDeployed] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [ropeHeightPercent, setRopeHeightPercent] = useState(0); // 0 to 1 during drop
  const [ropeBounce, setRopeBounce] = useState(0); // For elastic settling bounce

  // Cartoon characters and doors states
  const [doorsOpenPercent, setDoorsOpenPercent] = useState(0);
  const [orangeX, setOrangeX] = useState(0);
  const [blueX, setBlueX] = useState(0);
  const [orangeY, setOrangeY] = useState(0);
  const [blueY, setBlueY] = useState(0);
  const [walkTime, setWalkTime] = useState(0);
  const [animState, setAnimState] = useState("closed");

  // Cinematic products transition states
  const router = useRouter();
  const [transitionState, setTransitionState] = useState("idle"); // 'idle', 'focusing', 'opening', 'expanding'
  const [startRect, setStartRect] = useState(null);
  const [targetUrl, setTargetUrl] = useState("/products");

  // Global event listener for elevator transition trigger
  useEffect(() => {
    if (isAdmin) return;
    const handleTransitionEvent = (e) => {
      const url = e.detail?.targetUrl || "/products";
      const liftEl = document.getElementById("rope-elevator-lift");
      if (!liftEl) {
        sessionStorage.setItem("elevator-transition-active", "true");
        router.push(url);
        return;
      }
      const rect = liftEl.getBoundingClientRect();
      setStartRect(rect);
      setTargetUrl(url);
      setTransitionState("focusing");
    };

    window.addEventListener("trigger-elevator-transition", handleTransitionEvent);
    return () => {
      window.removeEventListener("trigger-elevator-transition", handleTransitionEvent);
    };
  }, [router, isAdmin]);

  // Transition timeline control machine
  useEffect(() => {
    if (isAdmin) return;
    if (transitionState === "focusing") {
      const timer = setTimeout(() => {
        setTransitionState("opening");
      }, 150); // Small initial delay to synchronize positions
      return () => clearTimeout(timer);
    } else if (transitionState === "opening") {
      const timer = setTimeout(() => {
        setTransitionState("expanding");
      }, 600); // 600ms for doors to slide open smoothly
      return () => clearTimeout(timer);
    } else if (transitionState === "expanding") {
      const timer = setTimeout(() => {
        sessionStorage.setItem("elevator-transition-active", "true");
        router.push(targetUrl);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [transitionState, targetUrl, router, isAdmin]);

  // Prevent user scroll interactions during transition sequence
  useEffect(() => {
    if (isAdmin) return;
    if (transitionState === "idle") return;

    const preventDefault = (e) => e.preventDefault();
    window.addEventListener("wheel", preventDefault, { passive: false });
    window.addEventListener("touchmove", preventDefault, { passive: false });
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("wheel", preventDefault);
      window.removeEventListener("touchmove", preventDefault);
      document.body.style.overflow = "";
    };
  }, [transitionState, isAdmin]);

  // Ref tracking for requestAnimationFrame loops
  const physicsRef = useRef({
    currentY: 0,
    targetY: 0,
    velocity: 0,
    sway: 0,
    time: 0,
    reducedMotion: false,
  });

  // Ref tracking for doors and characters animation states
  const animRef = useRef({
    state: "closed", // "closed", "opening", "walking_out", "outside", "running_in", "closing"
    orangeX: 0,
    blueX: 0,
    orangeY: 0,
    blueY: 0,
    walkTime: 0,
    doorsOpenPercent: 0,
  });

  // Calculate coordinates on resize/load (avoiding reflows during scroll)
  const calculateCoordinates = () => {
    const heroEl = document.getElementById("home") || document.querySelector("main section") || document.querySelector("section");
    const footerEl = document.getElementById("footer");

    if (!footerEl) return;

    const currentScrollY = window.scrollY;
    const currentScrollX = window.scrollX;

    const refRect = heroEl ? heroEl.getBoundingClientRect() : document.body.getBoundingClientRect();
    const footerRect = footerEl.getBoundingClientRect();

    const startY = heroEl
      ? (refRect.bottom + currentScrollY)
      : 150; // Fallback startY height (e.g. after header)
    const footerTopDoc = footerRect.top + currentScrollY;
    // Aligned to the right margin of the page containers
    let margin = 40;
    if (window.innerWidth < 768) {
      margin = 15;
    } else if (window.innerWidth < 1024) {
      margin = 25;
    }
    const startX = window.innerWidth + currentScrollX - margin;

    // Responsive cabin height to position the elevator exactly sitting at the footer entrance
    const w = window.innerWidth;
    const isMob = w < 768;
    const isTab = w >= 768 && w < 1024;
    const liftHeight = isMob ? 69 : isTab ? 76 : 92;
    const overlap = isMob ? 6 : isTab ? 8 : 10; // minimal overlap to protect footer text/inputs

    setCoords({
      startX,
      startY: startY - 5,
      endY: footerTopDoc - liftHeight + overlap,
    });
  };

  useEffect(() => {
    if (isAdmin) return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    physicsRef.current.reducedMotion = mediaQuery.matches;

    const timer1 = setTimeout(() => {
      calculateCoordinates();
    }, 0);
    window.addEventListener("load", calculateCoordinates);
    window.addEventListener("resize", calculateCoordinates);

    const checkSizes = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    const timer2 = setTimeout(checkSizes, 0);
    window.addEventListener("resize", checkSizes);

    // ResizeObserver to track dynamic body height changes (e.g., page height transitions, tab switching)
    let resizeObserver;
    let rafId;
    if (typeof window !== "undefined" && window.ResizeObserver) {
      resizeObserver = new window.ResizeObserver(() => {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(calculateCoordinates);
      });
      if (document.body) {
        resizeObserver.observe(document.body);
      }
    }

    // Dynamic layout sync double-check
    const timer = setTimeout(calculateCoordinates, 1500);

    // Session status check
    const hasRun = sessionStorage.getItem("shivshakti-rope-deployed");
    if (hasRun === "true" || physicsRef.current.reducedMotion) {
      setHasDeployed(true);
      setRopeHeightPercent(1);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener("load", calculateCoordinates);
      window.removeEventListener("resize", calculateCoordinates);
      window.removeEventListener("resize", checkSizes);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
    };
  }, [isAdmin]);
  // Track window scroll coordinates natively using passive scroll events
  useEffect(() => {
    if (isAdmin) return;
    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    scrollYRef.current = window.scrollY;
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isAdmin]);
  // Recalculate coordinates and auto-tag home hero element on path changes
  useEffect(() => {
    if (isAdmin) return;

    // Reset elevator transition states on pathname change to prevent getting stuck in expanding layout
    const resetTimer = setTimeout(() => {
      setTransitionState("idle");
      setStartRect(null);
    }, 0);

    // Disable easing during page transition to prevent sliding/glide glitch from previous scroll state
    skipEasingRef.current = true;
    const snapTimer = setTimeout(() => {
      skipEasingRef.current = false;
    }, 1200);

    // 1. Reset scroll reference to top of new page
    scrollYRef.current = 0;

    const isHomePage = pathname === "/";

    if (!isHomePage) {
      // Clean up any existing "home" ID to avoid duplicate/stale references on subpages
      const existingHome = document.getElementById("home");
      if (existingHome) {
        existingHome.removeAttribute("id");
      }

      // Automatically tag the top-most inner rounded container inside <main> as "home"
      const mainEl = document.querySelector("main");
      if (mainEl) {
        const firstSection = mainEl.querySelector("section");
        if (firstSection) {
          const innerCard = firstSection.firstElementChild;
          if (innerCard) {
            innerCard.setAttribute("id", "home");
            taggedElementRef.current = innerCard;
          }
        }
      }
    }

    // 2. Trigger layout calculations
    const calcTimer = setTimeout(calculateCoordinates, 0);

    // 3. Poll to make sure coordinates catch up with DOM updates/transition delays
    const timer1 = setTimeout(calculateCoordinates, 100);
    const timer2 = setTimeout(calculateCoordinates, 450); // around end of page transition fade-in
    const timer3 = setTimeout(calculateCoordinates, 1000);
    const timer4 = setTimeout(calculateCoordinates, 2000); // safety fallback for slow loads

    return () => {
      clearTimeout(resetTimer);
      clearTimeout(calcTimer);
      clearTimeout(snapTimer);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);

      // Cleanup dynamics: if we tagged an element, remove the ID from it
      if (taggedElementRef.current) {
        taggedElementRef.current.removeAttribute("id");
        taggedElementRef.current = null;
      }
    };
  }, [pathname, isAdmin]);

  // Intercept and slow down/dampen scrolling during rope deployment
  useEffect(() => {
    if (isAdmin) return;
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
  }, [isDeploying, isAdmin]);

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

  // Scroll trigger check: activates the deployment when scrolling past the Hero
  useEffect(() => {
    if (isAdmin) return;
    if (hasDeployed || isDeploying) return;

    const triggerCheck = () => {
      const heroEl = document.getElementById("home") || document.querySelector("main section") || document.querySelector("section");
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
  }, [hasDeployed, isDeploying, isAdmin]);

  // 60FPS physics loop for elevator movement, cable tension, and rotation sways
  useEffect(() => {
    if (isAdmin || !hasDeployed) return;

    if (physicsRef.current.currentY === 0) {
      physicsRef.current.currentY = coords.startY;
      physicsRef.current.targetY = coords.startY;
    }

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
      const cabinHeight = isMobile ? 69 : isTablet ? 76 : 92;
      const targetY = Math.max(
        coords.startY,
        Math.min(scrollY + viewportHeight / 2 - cabinHeight / 2, coords.endY)
      );

      physicsRef.current.targetY = targetY;

      // Ease positioning with linear interpolation (lerp factor 0.08)
      const diffY = targetY - physicsRef.current.currentY;
      
      if (skipEasingRef.current) {
        physicsRef.current.currentY = targetY;
        physicsRef.current.velocity = 0;
      } else {
        physicsRef.current.currentY += diffY * 0.08;
        physicsRef.current.velocity = diffY;
      }

      // Update dynamics metrics
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

      const liftWidth = isMobile ? 30 : isTablet ? 40 : 50;
      const liftHeight = isMobile ? 69 : isTablet ? 76 : 92;

      const blueXSvgTarget = -58;
      const orangeXSvgTarget = -50;

      // Doors and cartoon characters state machine
      const atBottom = coords.endY - physicsRef.current.currentY < 12;
      const anim = animRef.current;

      if (atBottom) {
        if (anim.state === "closed") {
          anim.state = "opening";
        }

        if (anim.state === "opening") {
          anim.doorsOpenPercent = Math.min(anim.doorsOpenPercent + 0.03, 1);
          if (anim.doorsOpenPercent >= 1) {
            anim.doorsOpenPercent = 1;
            anim.state = "walking_out";
          }
        }

        if (anim.state === "walking_out") {
          anim.walkTime += 1.2;

          // Both walk out together directly to their targets
          if (anim.orangeX > orangeXSvgTarget) {
            anim.orangeX = Math.max(anim.orangeX - 0.8, orangeXSvgTarget);
          }
          if (anim.blueX > blueXSvgTarget) {
            anim.blueX = Math.max(anim.blueX - 0.8, blueXSvgTarget);
          }

          if (anim.orangeX === orangeXSvgTarget && anim.blueX === blueXSvgTarget) {
            anim.state = "outside";
          }
        }

        if (anim.state === "outside") {
          anim.walkTime = 0; // stop leg swing
        }

        if (anim.state === "running_in" || anim.state === "closing") {
          anim.state = "opening";
        }
      } else {
        // Not at bottom (lift is rising)
        if (anim.state === "outside" || anim.state === "walking_out" || anim.state === "opening") {
          anim.state = "running_in";
        }

        if (anim.state === "running_in") {
          anim.walkTime += 2.2; // Run back with rapid leg swings

          if (anim.blueX < 0) {
            anim.blueX = Math.min(anim.blueX + 1.8, 0); // Fast running speed
          }
          if (anim.orangeX < 0) {
            anim.orangeX = Math.min(anim.orangeX + 1.8, 0); // Fast running speed
          }

          if (anim.blueX === 0 && anim.orangeX === 0) {
            anim.state = "closing";
          }
        }

        if (anim.state === "closing") {
          anim.doorsOpenPercent = Math.max(anim.doorsOpenPercent - 0.04, 0);
          if (anim.doorsOpenPercent <= 0) {
            anim.doorsOpenPercent = 0;
            anim.state = "closed";
          }
        }
      }

      // Convert target positions to SVG translations for sitting on the top of the footer (flat top line of the footer)
      // The footer top is located exactly at coords.endY - overlap + liftHeight.
      // We calculate the Y translation in SVG units relative to the current elevator cabin position.
      const overlap = 12;
      const blueYTarget = (60 - overlap * (60 / liftHeight)) - 29;
      const orangeYTarget = (60 - overlap * (60 / liftHeight)) - 29;

      const blueRatio = blueXSvgTarget !== 0 ? anim.blueX / blueXSvgTarget : 0;
      const orangeRatio = orangeXSvgTarget !== 0 ? anim.orangeX / orangeXSvgTarget : 0;

      const bobBlue = (anim.walkTime > 0 && anim.blueX > blueXSvgTarget && anim.blueX < 0)
        ? Math.abs(Math.sin(anim.walkTime * 0.5)) * -1.5
        : 0;
      const bobOrange = (anim.walkTime > 0 && anim.orangeX > orangeXSvgTarget && anim.orangeX < 0)
        ? Math.abs(Math.sin(anim.walkTime * 0.5 + 0.5)) * -1.5
        : 0;

      anim.blueY = blueRatio * blueYTarget + bobBlue;
      anim.orangeY = orangeRatio * orangeYTarget + bobOrange;

      // Sync refs to state variables for rendering (in frame loop)
      setDoorsOpenPercent(anim.doorsOpenPercent);
      setOrangeX(anim.orangeX);
      setBlueX(anim.blueX);
      setOrangeY(anim.orangeY);
      setBlueY(anim.blueY);
      setWalkTime(anim.walkTime);
      setAnimState(anim.state);

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
  const liftWidth = isMobile ? 30 : isTablet ? 40 : 50;
  const liftHeight = isMobile ? 69 : isTablet ? 76 : 92;

  if (isAdmin || coords.endY <= coords.startY) return null;

  return (
    <>
      {/* Rope Track and Guide Systems (Rendered in front of page backgrounds but behind cabin) */}
      <div
        ref={containerRef}
        className="absolute top-0 left-0 w-full pointer-events-none select-none z-20"
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
              opacity: transitionState === "idle" ? 1 : 0,
              transition: "opacity 0.25s ease-out",
            }}
          >
            {/* Detailed premium elevator model */}
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



              {/* Elevator split doors / Windows */}
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

              {/* Cartoon Characters (Revealed when doors open, walking out to the left) */}
              {doorsOpenPercent > 0 && (
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

                    {/* Stick Torso */}
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
              )}
            </svg>
          </div>
        </div>
      )}

      {/* Cinematic Modal Transition Overlay */}
      {transitionState !== "idle" && startRect && (
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
      )}
    </>
  );
};

export default RopeElevator;
