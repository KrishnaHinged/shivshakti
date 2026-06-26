/**
 * Converts a text string into a URL-friendly slug.
 *
 * @param {string} text - The input text (e.g. "Automatic Cabin Door")
 * @returns {string} Formatted slug string (e.g. "automatic-cabin-door").
 */
export default function slugify(text) {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")           // Replace spaces with -
    .replace(/[^\w\-]+/g, "")       // Remove all non-word chars
    .replace(/\-\-+/g, "-")         // Replace multiple - with single -
    .replace(/^-+/, "")             // Trim - from start
    .replace(/-+$/, "");            // Trim - from end
}
