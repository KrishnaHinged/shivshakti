"use client";

import React, { useState, useEffect, useRef } from "react";

export const Counter = ({ value, suffix = "", duration = 1500 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setHasStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasStarted) {
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
    if (!hasStarted) return;

    const numericStr = String(value).replace(/[^0-9]/g, "");
    const target = parseInt(numericStr, 10);
    if (isNaN(target)) {
      setCount(value);
      return;
    }

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
  }, [hasStarted, value, duration]);

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
