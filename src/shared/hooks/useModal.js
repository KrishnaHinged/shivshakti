import { useState, useCallback } from "react";

/**
 * Hook to manage simple open/close modal overlays state.
 *
 * @param {boolean} [initialState=false] - Initial state
 * @returns {[boolean, () => void, () => void, () => void]} State tuple: [isOpen, open, close, toggle]
 */
export default function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return [isOpen, open, close, toggle];
}
