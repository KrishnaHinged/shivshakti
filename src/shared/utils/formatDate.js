/**
 * Formats a Date object or date string into a standard, reader-friendly format.
 *
 * @param {Date|string} dateVal - Date instance or ISO string
 * @param {string} [locale="en-US"] - Language locale code
 * @returns {string} Formatted date text.
 */
export default function formatDate(dateVal, locale = "en-US") {
  if (!dateVal) return "";
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return "";

  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
