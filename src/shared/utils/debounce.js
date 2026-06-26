/**
 * Simple debounce function wrapper to limit execution frequency.
 *
 * @param {Function} func - The callback function to execute
 * @param {number} [wait=300] - Wait duration in milliseconds
 * @returns {Function} Debounced function.
 */
export default function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const latestCall = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(latestCall, wait);
  };
}
