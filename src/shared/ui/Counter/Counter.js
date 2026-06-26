"use client";

import React, { useState, useEffect, useRef } from "react";

/**
 * Counter component that animates counting up to a target numeric value when in view.
 * @param {object} props
 * @param {number|string} props.value - The final target numeric value
 * @param {string} [props.suffix] - Suffix appended to the number
 * @param {number} [props.duration] - Animation duration in ms
 */
export const Counter = ({ value, suffix = "", duration = 1500 }) => {
  const numericStr = String(value).replace(/[^0-9]/g, "");
  const target = parseInt(numericStr, 10);
  const isNumeric = !isNaN(target);

  const [count, setCount] = useState(() => (isNumeric ? 0 : value));
  const countRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (hasStarted) return;

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      const timer = setTimeout(() => setHasStarted(true), 0);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = countRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted || !isNumeric) return;

    let start = 0;
    const end = target;
    const stepTime = Math.max(Math.floor(duration / 30), 10);
    const stepValue = Math.ceil(end / (duration / stepTime));

    const timer = setInterval(() => {
      start += stepValue;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [hasStarted, isNumeric, target, duration]);

  const formatNumber = (num) => {
    if (value === 40000 || value === "40,000") {
      return num.toLocaleString("en-IN");
    }
    if (typeof value === "string" && value.includes(",")) {
      return num.toLocaleString("en-US");
    }
    return num;
  };

  return (
    <span ref={countRef}>
      {formatNumber(count)}{suffix}
    </span>
  );
};

export default Counter;
