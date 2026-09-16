"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";
import { prefersReducedMotion } from "./motion";
import { requestFrame, setLenis } from "./scroll-frame";

const LENIS_LERP = 0.085;
const NAV_CLEARANCE = 24;

/** Smooth wheel scrolling plus in-page links (#section) that glide instead of jumping. */
export function SmoothScroll() {
  useEffect(() => {
    const reduced = prefersReducedMotion();
    const lenis = reduced ? null : new Lenis({ lerp: LENIS_LERP, autoRaf: true });
    lenis?.on("scroll", requestFrame);
    setLenis(lenis);

    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[href^="#"]');
      if (!link) return;
      event.preventDefault();
      const id = link.getAttribute("href") ?? "";
      const target = id.length > 1 ? document.querySelector<HTMLElement>(id) : null;
      if (!target) return;
      const navHeight = document.querySelector<HTMLElement>(".nav")?.offsetHeight ?? 0;
      const offset = target.matches("section, main") ? 0 : -(navHeight + NAV_CLEARANCE);
      if (lenis) lenis.scrollTo(target, { offset });
      else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + offset, behavior: reduced ? "auto" : "smooth" });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
