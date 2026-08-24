import { clamp01 } from "./easing";

/** Progress (0-1) of a sticky-scroll spacer: 0 when its top just reaches the
 * viewport top, 1 when its bottom reaches the viewport bottom. */
export function getSpacerProgress(el: HTMLDivElement | null): number {
  if (!el) return 0;
  const rect = el.getBoundingClientRect();
  const total = el.offsetHeight - window.innerHeight;
  if (total <= 0) return 0;
  return clamp01(-rect.top / total);
}
