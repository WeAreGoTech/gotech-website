"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { prefersReducedMotion } from "@/components/site/motion";

const STAGGER_MS = 70;
// öğe ekranın alt %12'sine girmeden görünmesin: kaydırırken belirdiği fark edilsin
const REVEAL_MARGIN = "0px 0px -12% 0px";

/**
 * Sitenin iki küçük davranışı (bir şey çizmez; ana sayfa ve iç sayfaların kabuğunda çalışır):
 * 1. [data-in] öğeleri göründüğünde bir kez yumuşakça gelir (CSS: home.module.css). Hareket kapalıysa hepsi hemen görünür.
 * 2. data-konu taşıyan butonlar formdaki konuyu seçili getirir (ör. "Kurulumunuzu inceleyelim" -> geçiş);
 *    data-mesaj varsa ve mesaj alanı boşsa onu da yazar (ör. "Mikro Jump için demo istiyorum.").
 */
export function HomeEffects({ rootId }: { rootId: string }) {
  // kabuk (layout) sayfa değişince yeniden kurulmuyor: yeni sayfanın [data-in] öğeleri için gözlem her geçişte yenilenmeli,
  // yoksa kök data-ready taşıdığı için yedek animasyon da kapalı kalır ve öğeler hiç görünmez
  const pathname = usePathname();

  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-in]:not([data-in="on"])'));
    const show = (el: HTMLElement) => {
      el.dataset.in = "on";
    };

    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      items.forEach(show);
      return;
    }

    root.dataset.ready = "";
    const io = new IntersectionObserver((entries) => {
      entries.filter((e) => e.isIntersecting).forEach((entry, i) => {
        const el = entry.target as HTMLElement;
        el.style.transitionDelay = `${i * STAGGER_MS}ms`;
        // gecikme yalnız girişte: sonra hover geçişlerini geciktirmesin
        el.addEventListener("transitionend", () => el.style.removeProperty("transition-delay"), { once: true });
        show(el);
        io.unobserve(el);
      });
    }, { rootMargin: REVEAL_MARGIN });
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [rootId, pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const trigger = (event.target as Element | null)?.closest<HTMLElement>("[data-konu]");
      if (!trigger) return;
      const topic = document.querySelector<HTMLSelectElement>(`#${rootId} select[name="topic"]`);
      if (trigger.dataset.konu && topic) topic.value = trigger.dataset.konu;
      const message = document.querySelector<HTMLTextAreaElement>(`#${rootId} textarea[name="message"]`);
      if (trigger.dataset.mesaj && message && !message.value.trim()) message.value = trigger.dataset.mesaj;
      // klavyeyle gelen ziyaretçi formda kalsın: ilk boş alana odak (kaydırmayı SmoothScroll yapıyor)
      const first = document.querySelector<HTMLInputElement>(`#${rootId} #iletisim input[name="name"]`);
      if (first && !first.value) first.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [rootId]);

  return null;
}
