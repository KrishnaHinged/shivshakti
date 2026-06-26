import { useEffect } from "react";

/**
 * Hook to lock document body scrolling when a modal or drawer is active.
 *
 * @param {boolean} lock - Whether to lock the scrolling
 */
export default function useBodyLock(lock) {
  useEffect(() => {
    if (!lock) return;

    // Get original overflow style
    const originalStyle = window.getComputedStyle(document.body).overflow;
    
    // Prevent scrolling
    document.body.style.overflow = "hidden";

    // Re-enable scrolling on cleanup
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [lock]);
}
