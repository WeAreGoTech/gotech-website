export const NARROW_VIEWPORT = 760;

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const smooth = (t: number) => t * t * (3 - 2 * t);
export const isNarrow = () => window.innerWidth < NARROW_VIEWPORT;
export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** 0 → 1 while a tall "pin" element scrolls past its sticky child. */
export function pinProgress(pin: HTMLElement) {
  const r = pin.getBoundingClientRect();
  const span = r.height - window.innerHeight;
  return span > 0 ? clamp(-r.top / span) : 0;
}
