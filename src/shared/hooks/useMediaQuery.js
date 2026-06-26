import { useState, useEffect } from "react";

/**
 * Hook to match media queries reactively.
 * Used for screen responsive checking (e.g. tablet vs. mobile) in JS.
 *
 * @param {string} query - CSS media query string (e.g., '(max-width: 768px)')
 * @returns {boolean} Whether the media query matches.
 */
export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMatches(media.matches);
    }
    
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    
    return () => media.removeEventListener("change", listener);
  }, [query, matches]);

  return matches;
}
