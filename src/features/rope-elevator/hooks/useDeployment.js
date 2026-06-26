import { useEffect, useRef, useState } from "react";
import { DEPLOYMENT } from "../constants/physics";

/**
 * Hook to manage the rope elevator dropping/deployment and elastic bouncing animations.
 * Handles scrolling dampening during the active deploy window.
 * 
 * @param {boolean} isAdmin
 * @param {boolean} isAbout
 */
export default function useDeployment(isAdmin, isAbout) {
  const [hasDeployed, setHasDeployed] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [ropeHeightPercent, setRopeHeightPercent] = useState(0); // 0 to 1 during drop
  const [ropeBounce, setRopeBounce] = useState(0); // Settle spring bounce offset
  
  const requestRef = useRef(null);
  const touchStartRef = useRef(0);

  // Sync state if already deployed in current session
  useEffect(() => {
    if (isAdmin) return;
    
    // Check if prefers-reduced-motion is enabled
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hasRun = sessionStorage.getItem("shivshakti-rope-deployed");
    
    if (hasRun === "true" || mediaQuery.matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHasDeployed(true);
      setRopeHeightPercent(1);
    }
  }, [isAdmin]);

  // Intercept and dampen user scrolls during the active deployment phase
  useEffect(() => {
    if (isAdmin || !isDeploying) return;

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

    const animateRope = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / DEPLOYMENT.SETTLE_DELAY, 1);

      // Elastic drop easing formula
      const easeProgress = progress === 1
        ? 1
        : 1 - Math.pow(2, -10 * progress) * Math.cos((progress * 2.5 - 0.75) * Math.PI);
        
      setRopeHeightPercent(easeProgress);

      // Settle spring oscillations
      if (elapsed > DEPLOYMENT.SETTLE_DELAY) {
        const settleProgress = (elapsed - DEPLOYMENT.SETTLE_DELAY) / DEPLOYMENT.SETTLE_SPEED;
        const bounce = Math.sin(settleProgress * Math.PI * DEPLOYMENT.SETTLE_FREQ_MULTIPLIER) * 
                       Math.pow(1 - settleProgress, 2.5) * 
                       DEPLOYMENT.SETTLE_AMP_FACTOR;
        setRopeBounce(bounce);
      }

      if (elapsed < DEPLOYMENT.TOTAL_DURATION) {
        requestRef.current = requestAnimationFrame(animateRope);
      } else {
        setRopeHeightPercent(1);
        setRopeBounce(0);
        setHasDeployed(true);
        setIsDeploying(false);
        sessionStorage.setItem("shivshakti-rope-deployed", "true");
      }
    };

    requestRef.current = requestAnimationFrame(animateRope);
  };

  // Scroll trigger check: deploys when passing the Hero bottom bounds
  useEffect(() => {
    if (isAdmin || hasDeployed || isDeploying) return;

    const triggerCheck = () => {
      const heroEl = document.getElementById("home") || 
                     document.querySelector("main section") || 
                     document.querySelector("section");
      if (!heroEl) return;

      const heroRect = heroEl.getBoundingClientRect();
      if (heroRect.bottom < window.innerHeight * 0.75) {
        window.removeEventListener("scroll", triggerCheck);
        startDeployment();
      }
    };

    window.addEventListener("scroll", triggerCheck);
    return () => {
      window.removeEventListener("scroll", triggerCheck);
      cancelAnimationFrame(requestRef.current);
    };
  }, [hasDeployed, isDeploying, isAdmin]);

  return {
    hasDeployed,
    isDeploying,
    ropeHeightPercent,
    ropeBounce,
  };
}
