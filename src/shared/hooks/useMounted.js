import { useState, useEffect } from "react";

/**
 * Hook to safeguard and determine if a component is mounted on the client-side.
 * Used to prevent server-side hydration mismatches.
 *
 * @returns {boolean} Whether the component has mounted on the client.
 */
export default function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return mounted;
}
