import { useState, useCallback } from "react";

/**
 * Hook to manage selected active tabs/pills index state.
 *
 * @param {string|number} initialTab - Initial active tab identifier
 * @returns {[string|number, (tabId: string|number) => void]} State tuple: [activeTab, changeTab]
 */
export default function useTabs(initialTab) {
  const [activeTab, setActiveTab] = useState(initialTab);

  const changeTab = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  return [activeTab, changeTab];
}
