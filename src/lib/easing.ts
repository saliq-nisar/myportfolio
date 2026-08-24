export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** Remaps t from [inMin, inMax] to [0, 1], clamped. */
export const remap = (t: number, inMin: number, inMax: number) =>
  clamp01((t - inMin) / (inMax - inMin));

/** Triangular falloff: 1 at t === center, fading linearly to 0 at ±halfWidth. */
export const proximityFalloff = (t: number, center: number, halfWidth: number) =>
  clamp01(1 - Math.abs(t - center) / halfWidth);

/** Trapezoidal falloff: full strength (1) within ±plateauHalf of center, then
 * fades linearly to 0 over the next falloffWidth. Gives the reader a wide,
 * stable "fully visible" scroll window instead of a single instantaneous
 * peak — content stays put long enough to actually read. */
export const plateauFalloff = (
  t: number,
  center: number,
  plateauHalf: number,
  falloffWidth: number
) => {
  const d = Math.abs(t - center);
  if (d <= plateauHalf) return 1;
  return clamp01(1 - (d - plateauHalf) / falloffWidth);
};
