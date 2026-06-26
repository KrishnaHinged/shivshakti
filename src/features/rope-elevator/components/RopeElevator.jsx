"use client";

import React, { useRef } from "react";
import { usePathname } from "next/navigation";
import useDeployment from "../hooks/useDeployment";
import useTransition from "../hooks/useTransition";
import usePhysics from "../hooks/usePhysics";
import Cable from "./Cable";
import ElevatorCabin from "./ElevatorCabin";
import TransitionOverlay from "./TransitionOverlay";

/**
 * RopeElevator orchestrates the guide tracks, metallic cables, 
 * physical cabin animation, scroll triggers, and path transitions.
 */
export const RopeElevator = () => {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const scrollYRef = useRef(0);
  const skipEasingRef = useRef(false);

  // Custom hook: Manage dynamic coordinates and cinematic transition timelines
  const {
    coords,
    isMobile,
    isTablet,
    transitionState,
    startRect,
    isAbout,
  } = useTransition(isAdmin, scrollYRef, skipEasingRef);

  // Custom hook: Manage initial drop deployment physics and damping
  const {
    hasDeployed,
    ropeHeightPercent,
    ropeBounce,
  } = useDeployment(isAdmin, isAbout);

  // Custom hook: 60FPS animation loop for sways, doors, and characters
  const {
    doorsOpenPercent,
    orangeX,
    blueX,
    orangeY,
    blueY,
    walkTime,
    animState,
  } = usePhysics(
    hasDeployed,
    coords,
    isMobile,
    isTablet,
    scrollYRef,
    skipEasingRef
  );

  const totalHeight = coords.endY - coords.startY;
  const currentRopeLength = totalHeight * ropeHeightPercent + ropeBounce;

  // Responsive layout sizes
  const liftWidth = isMobile ? 30 : isTablet ? 40 : 50;
  const liftHeight = isMobile ? 69 : isTablet ? 76 : 92;

  // If in admin dashboard or layout is invalid, do not render
  if (isAdmin || coords.endY <= coords.startY) return null;

  return (
    <>
      {/* Rope Track and Guide Systems */}
      <div
        className="absolute top-0 left-0 w-full pointer-events-none select-none z-20"
        style={{ height: `${coords.endY + 200}px` }}
      >
        <Cable
          coords={coords}
          currentRopeLength={currentRopeLength}
          isMobile={isMobile}
          totalHeight={totalHeight}
        />
      </div>

      {/* Lift Cabin */}
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
            <ElevatorCabin
              isMobile={isMobile}
              isTablet={isTablet}
              doorsOpenPercent={doorsOpenPercent}
              blueX={blueX}
              blueY={blueY}
              orangeX={orangeX}
              orangeY={orangeY}
              animState={animState}
              walkTime={walkTime}
            />
          </div>
        </div>
      )}

      {/* Full-screen expanding transition page loader */}
      <TransitionOverlay
        transitionState={transitionState}
        startRect={startRect}
        liftWidth={liftWidth}
        liftHeight={liftHeight}
      />
    </>
  );
};

export default RopeElevator;
