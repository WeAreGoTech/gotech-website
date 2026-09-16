/* Shared helpers and render scheduling. Classic scripts loaded in order: core → hero-b → hero-c → page. */
const qs = (s, r = document) => r.querySelector(s);
const qsa = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeOut = t => 1 - Math.pow(1 - t, 3);
const easeInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const smooth = t => t * t * (3 - 2 * t);
const NARROW = 760;
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isNarrow = () => innerWidth < NARROW;

function pinProgress(pin) {
  const r = pin.getBoundingClientRect();
  const span = r.height - innerHeight;
  return span > 0 ? clamp(-r.top / span) : 0;
}

history.scrollRestoration = 'manual';
const nav = qs('.nav');
const frame = { dirty: true };
const requestRender = () => { frame.dirty = true; };

let lenis = null;
if (window.Lenis && !REDUCED) {
  lenis = new Lenis({ lerp: .085 });
  const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
}
