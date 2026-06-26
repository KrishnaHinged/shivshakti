/**
 * Truncates a string to a max character count and adds ellipsis if exceeded.
 *
 * @param {string} text - The input text
 * @param {number} [limit=100] - Maximum characters count allowed
 * @param {string} [suffix="..."] - The ellipsis string
 * @returns {string} Truncated string.
 */
export default function truncate(text, limit = 100, suffix = "...") {
  if (!text) return "";
  const str = String(text);
  if (str.length <= limit) return str;
  return str.slice(0, limit).trim() + suffix;
}
