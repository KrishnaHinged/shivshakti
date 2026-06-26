import { useState, useEffect, useRef } from "react";

/**
 * Custom hook to detect when an element enters the viewport.
 * @param {IntersectionObserverInit} [options] - Configuration options for the observer
 * @returns {[React.RefObject<HTMLElement|null>, boolean]} Reference to bind to the element, and boolean flag indicating if in view
 */
export function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      const timer = setTimeout(() => setInView(true), 0);
      return () => clearTimeout(timer);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, ...options }
    );
    const el = ref.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return [ref, inView];
}

export default useInView;
