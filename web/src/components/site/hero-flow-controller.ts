import { clamp, easeInOut, isNarrow, lerp, pinProgress, prefersReducedMotion, smooth } from "./motion";
import { requestFrame } from "./scroll-frame";

const PACKET_LABELS = ["Yeni sipariş #1042", "Sipariş kaydedildi", "Stoktan 2 adet düştü", "e-Fatura gönderildi", "Rapora işlendi"];
// LINE_MID must match the 54fr/46fr row split of .b-step in hero-flow.css
const LINE_MID = 0.54;
const PACKET_DRAW_MS = 1300;
const PACKET_DELAY_MS = 450;
const DOT_PARALLAX = 0.35;
const LINE_SAMPLE_PX = 12;

/**
 * Imperative scroll choreography for the hero: vertical scroll moves a horizontal track,
 * an order "packet" rides the line and switches each step on as it passes.
 * DOM writes happen here instead of React state to stay at 60fps.
 */
export function createHeroFlow(root: HTMLElement) {
  const one = <T extends Element>(selector: string) => root.querySelector<T>(selector)!;
  const all = <T extends Element>(selector: string) => [...root.querySelectorAll<T>(selector)];

  const pin = one<HTMLElement>(".pin");
  const stage = one<HTMLElement>(".b-stage");
  const dots = one<HTMLElement>(".b-dots");
  const track = one<HTMLElement>(".b-track");
  const intro = one<HTMLElement>(".b-intro");
  const end = one<HTMLElement>(".b-end");
  const steps = all<HTMLElement>(".b-step");
  const nodeEls = all<HTMLElement>(".b-node");
  const svg = one<SVGSVGElement>(".b-line");
  const basePath = one<SVGPathElement>(".b-path-base");
  const litPath = one<SVGPathElement>(".b-path-lit");
  const clip = one<SVGRectElement>(".b-clip-rect");
  const packet = one<HTMLElement>(".b-packet");
  const label = one<HTMLElement>(".b-packet-label");
  const stepper = one<HTMLElement>(".b-stepper");
  const stepperItems = all<HTMLElement>(".b-stepper li");
  const stepperFill = one<HTMLElement>(".b-stepper-track i");

  let width = 0;
  let height = 0;
  let introW = 0;
  let stepW = 1;
  let lineEnd = 0;
  let nodeXs: number[] = [];
  let introT = 0;
  let lastPassed = -1;
  let introRaf = 0;

  // line height at track x: rises out of the intro, then waves through each step
  function yAt(x: number) {
    const mid = height * LINE_MID;
    if (x < introW) return lerp(height * 0.9, mid, smooth(clamp((x - introW * 0.4) / (introW * 0.6))));
    return mid + Math.sin(((x - introW) / stepW) * Math.PI) * height * (isNarrow() ? 0.02 : 0.04);
  }

  function layout() {
    // measure panels, not scrollWidth: the absolutely positioned svg would inflate it
    width = end.offsetLeft + end.offsetWidth;
    height = stage.clientHeight;
    introW = intro.offsetWidth;
    stepW = steps[0].offsetWidth;
    lineEnd = end.offsetLeft + end.offsetWidth * (isNarrow() ? 0.25 : 0.3);

    svg.setAttribute("width", String(width));
    svg.setAttribute("height", String(height));
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    let d = "";
    for (let x = 0; x <= lineEnd; x += LINE_SAMPLE_PX) d += `${x ? "L" : "M"}${x.toFixed(1)} ${yAt(x).toFixed(1)}`;
    basePath.setAttribute("d", d);
    litPath.setAttribute("d", d);
    clip.setAttribute("height", String(height));

    nodeXs = [...steps.map((s) => s.offsetLeft + s.offsetWidth / 2), lineEnd];
    nodeXs.forEach((x, i) => {
      nodeEls[i].style.left = `${x}px`;
      nodeEls[i].style.top = `${yAt(x)}px`;
    });
  }

  function update() {
    const p = pinProgress(pin);
    const tx = p * Math.max(0, width - window.innerWidth);
    track.style.transform = `translate3d(${-tx}px,0,0)`;
    dots.style.backgroundPosition = `${-tx * DOT_PARALLAX}px 0`;

    const px = Math.min(lineEnd, tx + window.innerWidth * 0.5) * introT;
    packet.style.transform = `translate3d(${px}px, ${yAt(px)}px, 0) translate(-50%, -50%)`;
    packet.style.opacity = String(clamp(introT * 3));
    clip.setAttribute("width", String(px));

    let passed = 0;
    nodeXs.forEach((x, i) => {
      const on = px >= x - 1;
      nodeEls[i].classList.toggle("is-on", on);
      if (i < steps.length) {
        steps[i].classList.toggle("is-on", on);
        if (on) passed++;
      }
    });
    if (passed !== lastPassed) {
      label.textContent = PACKET_LABELS[passed];
      if (lastPassed !== -1 && !prefersReducedMotion()) {
        label.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 380, easing: "ease-out" });
      }
      lastPassed = passed;
    }

    const first = nodeXs[0];
    const last = nodeXs[steps.length - 1];
    stepperFill.style.transform = `scaleX(${clamp((px - first) / (last - first))})`;
    stepperItems.forEach((li, i) => li.classList.toggle("is-on", i < passed));
    stepper.style.opacity = String(smooth(clamp((tx - introW * 0.35) / (introW * 0.3))));
  }

  function enter() {
    requestAnimationFrame(() => root.classList.add("is-ready"));
    if (prefersReducedMotion()) {
      introT = 1;
      requestFrame();
      return;
    }
    const start = performance.now() + PACKET_DELAY_MS;
    const drawIn = (now: number) => {
      introT = easeInOut(clamp((now - start) / PACKET_DRAW_MS));
      requestFrame();
      if (introT < 1) introRaf = requestAnimationFrame(drawIn);
    };
    introRaf = requestAnimationFrame(drawIn);
  }

  return { layout, update, enter, destroy: () => cancelAnimationFrame(introRaf) };
}
