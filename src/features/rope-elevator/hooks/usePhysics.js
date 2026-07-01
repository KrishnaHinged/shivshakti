import { useEffect, useRef, useState } from "react";
import { PHYSICS, CHARACTERS, DOORS } from "../constants/physics";
import { SVG_TARGETS } from "../constants/dimensions";
import { lerp } from "../utils/math";

/**
 * Hook to manage elevator physics, sways, tilt, and character walk/run states.
 * 
 * @param {boolean} hasDeployed
 * @param {Object} coords - startX, startY, endY
 * @param {boolean} isMobile
 * @param {boolean} isTablet
 * @param {Object} scrollYRef - Ref to current scroll position
 * @param {Object} skipEasingRef - Ref to skip easing flag
 */
export default function usePhysics(
  hasDeployed,
  coords,
  isMobile,
  isTablet,
  scrollYRef,
  skipEasingRef
) {
  // Sync state variables for React rendering
  const [doorsOpenPercent, setDoorsOpenPercent] = useState(0);
  const [orangeX, setOrangeX] = useState(0);
  const [blueX, setBlueX] = useState(0);
  const [orangeY, setOrangeY] = useState(0);
  const [blueY, setBlueY] = useState(0);
  const [walkTime, setWalkTime] = useState(0);
  const [animState, setAnimState] = useState("closed");

  // Keep references to values updated in 60FPS loop
  const physicsRef = useRef({
    currentY: 0,
    targetY: 0,
    velocity: 0,
    sway: 0,
    time: 0,
    reducedMotion: false,
  });

  const animRef = useRef({
    state: "closed", // "closed", "opening", "walking_out", "outside", "running_in", "closing"
    orangeX: 0,
    blueX: 0,
    orangeY: 0,
    blueY: 0,
    walkTime: 0,
    doorsOpenPercent: 0,
  });

  const requestRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      physicsRef.current.reducedMotion = mediaQuery.matches;
    }
  }, []);

  // 60FPS animation loop
  useEffect(() => {
    if (!hasDeployed) return;

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
      
      if (skipEasingRef.current || physicsRef.current.reducedMotion) {
        physicsRef.current.currentY = targetY;
        physicsRef.current.velocity = 0;
      } else {
        physicsRef.current.currentY += diffY * PHYSICS.LERP_FACTOR;
        physicsRef.current.velocity = diffY;
      }

      // Update dynamics metrics
      physicsRef.current.time += 1;

      // Pendulum and vibration sways:
      const pendulum = Math.sin(physicsRef.current.time * PHYSICS.PENDULUM_SWAY_SPEED) * PHYSICS.PENDULUM_SWAY_AMP;
      const velocitySway = Math.sin(physicsRef.current.time * PHYSICS.VELOCITY_SWAY_SPEED) * (physicsRef.current.velocity * PHYSICS.VELOCITY_SWAY_AMP);
      const tensionVibe = Math.abs(physicsRef.current.velocity) > PHYSICS.VIBRATION_THRESHOLD
        ? Math.sin(physicsRef.current.time * PHYSICS.VIBRATION_SPEED) * PHYSICS.VIBRATION_AMP
        : 0;

      const totalSway = physicsRef.current.reducedMotion ? 0 : (pendulum + velocitySway + tensionVibe);
      physicsRef.current.sway = totalSway;

      // Safe rotational tilt constraint: max +/- 3 degrees
      const tilt = physicsRef.current.reducedMotion ? 0 : Math.max(-PHYSICS.MAX_TILT, Math.min(PHYSICS.MAX_TILT, totalSway * PHYSICS.TILT_FACTOR));

      // Doors and cartoon characters state machine
      const atBottom = coords.endY - physicsRef.current.currentY < 12;
      const anim = animRef.current;

      if (atBottom) {
        if (anim.state === "closed") {
          anim.state = "opening";
        }

        if (anim.state === "opening") {
          anim.doorsOpenPercent = Math.min(anim.doorsOpenPercent + DOORS.OPEN_SPEED, 1);
          if (anim.doorsOpenPercent >= 1) {
            anim.doorsOpenPercent = 1;
            anim.state = "walking_out";
          }
        }

        if (anim.state === "walking_out") {
          anim.walkTime += CHARACTERS.WALK_LEG_SPEED;

          if (anim.orangeX > SVG_TARGETS.ORANGE_CHAR_X) {
            anim.orangeX = Math.max(anim.orangeX - 0.8, SVG_TARGETS.ORANGE_CHAR_X);
          }
          if (anim.blueX > SVG_TARGETS.BLUE_CHAR_X) {
            anim.blueX = Math.max(anim.blueX - 0.8, SVG_TARGETS.BLUE_CHAR_X);
          }

          if (anim.orangeX === SVG_TARGETS.ORANGE_CHAR_X && anim.blueX === SVG_TARGETS.BLUE_CHAR_X) {
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
          anim.walkTime += CHARACTERS.RUN_LEG_SPEED; // Run back with rapid leg swings

          if (anim.blueX < 0) {
            anim.blueX = Math.min(anim.blueX + CHARACTERS.RUN_SPEED_DELTA, 0);
          }
          if (anim.orangeX < 0) {
            anim.orangeX = Math.min(anim.orangeX + CHARACTERS.RUN_SPEED_DELTA, 0);
          }

          if (anim.blueX === 0 && anim.orangeX === 0) {
            anim.state = "closing";
          }
        }

        if (anim.state === "closing") {
          anim.doorsOpenPercent = Math.max(anim.doorsOpenPercent - DOORS.CLOSE_SPEED, 0);
          if (anim.doorsOpenPercent <= 0) {
            anim.doorsOpenPercent = 0;
            anim.state = "closed";
          }
        }
      }

      // Convert target positions to SVG translations relative to cabin
      const liftHeight = isMobile ? 69 : isTablet ? 76 : 92;
      const overlap = 12;
      const blueYTarget = (60 - overlap * (60 / liftHeight)) - 29;
      const orangeYTarget = (60 - overlap * (60 / liftHeight)) - 29;

      const blueRatio = SVG_TARGETS.BLUE_CHAR_X !== 0 ? anim.blueX / SVG_TARGETS.BLUE_CHAR_X : 0;
      const orangeRatio = SVG_TARGETS.ORANGE_CHAR_X !== 0 ? anim.orangeX / SVG_TARGETS.ORANGE_CHAR_X : 0;

      const bobBlue = (anim.walkTime > 0 && anim.blueX > SVG_TARGETS.BLUE_CHAR_X && anim.blueX < 0)
        ? Math.abs(Math.sin(anim.walkTime * 0.5)) * CHARACTERS.WALK_BOB_AMP
        : 0;
      const bobOrange = (anim.walkTime > 0 && anim.orangeX > SVG_TARGETS.ORANGE_CHAR_X && anim.orangeX < 0)
        ? Math.abs(Math.sin(anim.walkTime * 0.5 + 0.5)) * CHARACTERS.WALK_BOB_AMP
        : 0;

      anim.blueY = blueRatio * blueYTarget + bobBlue;
      anim.orangeY = orangeRatio * orangeYTarget + bobOrange;

      // Sync refs to state variables for rendering
      setDoorsOpenPercent(anim.doorsOpenPercent);
      setOrangeX(anim.orangeX);
      setBlueX(anim.blueX);
      setOrangeY(anim.orangeY);
      setBlueY(anim.blueY);
      setWalkTime(anim.walkTime);
      setAnimState(anim.state);

      // Direct DOM manipulation for high performance
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
  }, [hasDeployed, coords.startX, coords.startY, coords.endY, isMobile, isTablet, scrollYRef, skipEasingRef]);

  return {
    doorsOpenPercent,
    orangeX,
    blueX,
    orangeY,
    blueY,
    walkTime,
    animState,
  };
}
