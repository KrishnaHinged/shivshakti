/**
 * Aspect Ratio Validation Utility
 * Used in admin 360° view upload to enforce correct image ratios
 */

// Max file size: 5MB
export const MAX_360_FILE_SIZE = 5 * 1024 * 1024;

// Allowed file types
export const ALLOWED_360_TYPES = ["image/jpeg", "image/png"];

/**
 * Validate a file for 360° view upload (type + size only — cropping handles ratio)
 * @param {File} file
 * @returns {{valid: boolean, error: string|null}}
 */
export function validate360File(file) {
  if (!ALLOWED_360_TYPES.includes(file.type)) {
    return { valid: false, error: "Only JPG and PNG images are accepted." };
  }
  if (file.size > MAX_360_FILE_SIZE) {
    return { valid: false, error: "File size exceeds the 5MB limit." };
  }
  return { valid: true, error: null };
}

/**
 * Slot configuration for the upload grid.
 *
 * Ratios (width:height):
 *   Front:         3:5  (portrait, doors face)
 *   Back:          3:5  (portrait)
 *   Side Walls:    3:5  (same image for left & right)
 *   Ceiling:       1:1  (square)
 *   Floor:         1:1  (square)
 *
 * `key`     – primary field in the view360 object
 * `syncKey` – if set, this field also gets the same URL (left↔right sync)
 */
export const VIEW_360_SLOTS = [
  {
    key: "front",
    label: "Front Wall (Doors)",
    caption: "Looking at the elevator doors • Ratio 3:5",
    aspect: 3 / 5,
    aspectLabel: "3:5",
    recommended: "900 × 1500 px",
  },
  {
    key: "back",
    label: "Back Wall",
    caption: "Looking at the rear wall • Ratio 3:5",
    aspect: 3 / 5,
    aspectLabel: "3:5",
    recommended: "900 × 1500 px",
  },
  {
    key: "left",
    syncKey: "right",
    label: "Side Walls (Left & Right)",
    caption: "Same image used for both side walls • Ratio 3:5",
    aspect: 3 / 5,
    aspectLabel: "3:5",
    recommended: "900 × 1500 px",
  },
  {
    key: "ceiling",
    label: "Ceiling",
    caption: "Looking straight up • Ratio 1:1",
    aspect: 1 / 1,
    aspectLabel: "1:1",
    recommended: "1200 × 1200 px",
  },
  {
    key: "floor",
    label: "Floor",
    caption: "Looking straight down • Ratio 1:1",
    aspect: 1 / 1,
    aspectLabel: "1:1",
    recommended: "1200 × 1200 px",
  },
];
