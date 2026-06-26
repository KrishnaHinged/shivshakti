/**
 * Clamps a value between a minimum and a maximum range.
 * @param {number} val
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

/**
 * Performs a linear interpolation between two values.
 * @param {number} start
 * @param {number} end
 * @param {number} amt
 * @returns {number}
 */
export const lerp = (start, end, amt) => (1 - amt) * start + amt * end;
