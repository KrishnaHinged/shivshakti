"use client";

import React from "react";
import { useInView } from "@/shared/hooks";

/**
 * A wrapper component that animates timeline items as they enter the viewport.
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {number} props.index - The timeline item index for stagger delay calculation
 */
export function AnimatedTimelineItem({ children, index }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className="relative group pl-10 lg:pl-0 transition-all duration-300"
      style={{
        opacity: inView ? 1 : 0,
        filter: inView ? "blur(0px)" : "blur(4px)",
        transform: inView ? "translateX(0)" : "translateX(-20px)",
        transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.08}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.08}s, filter 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.08}s`,
      }}
    >
      {children}
    </div>
  );
}

export default AnimatedTimelineItem;
