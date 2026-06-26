"use client";

import React from "react";
import { useInView } from "@/shared/hooks";

/**
 * FadeIn viewport-aware animation wrapper.
 */
export function FadeIn({ children, className = "", delay = 0, duration = 0.5 }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/**
 * SlideUp viewport-aware animation wrapper.
 */
export function SlideUp({ children, className = "", delay = 0, duration = 0.7, distance = "24px" }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : `translateY(${distance})`,
        transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/**
 * ScaleIn viewport-aware animation wrapper.
 */
export function ScaleIn({ children, className = "", delay = 0, duration = 0.6, scale = 0.95 }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "scale(1)" : `scale(${scale})`,
        transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
