"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./motion";

const LENIS_LERP = 0.085;
const NAV_CLEARANCE = 24;

/**
 * Smooth wheel scrolling plus in-page links (#section) that glide instead of jumping.
 * The link's target also receives focus and the address gets its hash, so keyboard users land where they scrolled
 * (skip link, "demo" buttons). On a route change the new page starts at its top instead of gliding from the old offset.
 */
export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const lenis = reduced ? null : new Lenis({ lerp: LENIS_LERP, autoRaf: true });
    lenisRef.current = lenis;

    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href") ?? "";
      const target = id.length > 1 ? document.querySelector<HTMLElement>(id) : null;
      if (!target) return;
      event.preventDefault();
      const navHeight = document.querySelector<HTMLElement>(".nav, [data-sticky-nav]")?.offsetHeight ?? 0;
      const offset = target.matches("section, main") ? 0 : -(navHeight + NAV_CLEARANCE);
      if (lenis) lenis.scrollTo(target, { offset });
      else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + offset, behavior: reduced ? "auto" : "smooth" });
      history.pushState(null, "", id);
      // odak kaydırılan yere gitsin; data-konu tıklamaları (HomeEffects) formdaki alana ayrıca odaklar
      if (!link.hasAttribute("data-konu")) {
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      lenis?.destroy();
      lenisRef.current = null;
    };
  }, []);

  // yeni sayfa eski kaydırma konumundan akarak açılmasın
  useEffect(() => {
    if (location.hash) return;
    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}
