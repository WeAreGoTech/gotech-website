"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";
import { prefersReducedMotion } from "@/components/site/motion";

gsap.registerPlugin(ScrollTrigger, SplitText);

const LENIS_LERP = 0.09;
const NAV_CLEARANCE = 24;
const WORD_FROM = "#c5c8ce";
const REFRESH_DEBOUNCE_MS = 200;
const WORD_TO = "#121417";

let lenis: Lenis | null = null;

/**
 * Sayfalar arası geçişte yeni sayfanın ilk ekranı (sayfanın başından bir ekran boyu) giriş animasyonu beklemeden son hâlinde
 * görünür: gizli başlayıp ardından beliren içerik "sayfa yanıp sönüyor" gibi görünüyordu. Aşağıdakiler kaydırdıkça yine belirir.
 * Yeni içerik DOM'a girdiği anda, tarayıcı çizmeden önce çalışır (MutationObserver); konum sayfanın başına göre.
 */
function showFirstScreen(root: HTMLElement) {
  const fold = window.innerHeight;
  const onFirstScreen = (el: Element) => el.getBoundingClientRect().top + window.scrollY < fold;
  root.querySelectorAll<HTMLElement>("[data-reveal], [data-media]").forEach((el) => {
    if (onFirstScreen(el)) el.setAttribute("data-shown", "");
  });
  root.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
    if (!onFirstScreen(el)) return;
    el.dataset.played = "1";
    el.style.visibility = "visible";
  });
  root.querySelectorAll<HTMLElement>("[data-draw]").forEach((el) => {
    if (onFirstScreen(el)) el.style.transform = "none";
  });
}

/** Sayfa içi kaydırma: Lenis varsa yumuşak, yoksa tarayıcının kendi kaydırması. */
export function scrollToTarget(target: HTMLElement | number, immediate = false) {
  const nav = document.querySelector<HTMLElement>("[data-nav]")?.offsetHeight ?? 0;
  const offset = typeof target === "number" || target.matches("section, main") ? 0 : -(nav + NAV_CLEARANCE);
  if (lenis) {
    lenis.scrollTo(target, { offset, immediate, force: true });
    return;
  }
  const top = typeof target === "number" ? target : target.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: immediate || prefersReducedMotion() ? "auto" : "smooth" });
}

/** Menü açıkken sayfa kaymasın. */
export function lockScroll(locked: boolean) {
  if (locked) lenis?.stop();
  else lenis?.start();
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

/** Başlık satırları maskeden yükselir (data-split). data-delay: saniye. Bir kez oynar; yeniden bölünmede tekrar oynamaz. */
function splitHeadings(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
    SplitText.create(el, {
      type: "lines",
      mask: "lines",
      linesClass: "ln",
      autoSplit: true,
      onSplit(self) {
        gsap.set(el, { visibility: "visible" });
        if (el.dataset.played) return;
        return gsap.from(self.lines, {
          yPercent: 112,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.09,
          delay: Number(el.dataset.delay ?? 0),
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onComplete: () => {
            el.dataset.played = "1";
          },
        });
      },
    });
  });
}

/** Yazı ve bloklar aşağıdan gelir; aynı anda görünenler sırayla. */
function reveals(root: HTMLElement) {
  const items = root.querySelectorAll<HTMLElement>("[data-reveal]");
  if (!items.length) return;
  ScrollTrigger.batch(items, {
    start: "top 92%",
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 1.05,
        ease: "power3.out",
        stagger: 0.08,
        delay: (_i: number, el: HTMLElement) => Number(el.dataset.delay ?? 0),
        overwrite: true,
        // bitince satır içi stil kalmasın (hover dönüşümleri serbest); data-shown CSS'teki başlangıç durumunu kapatır
        clearProps: "opacity,transform",
        onComplete: () => batch.forEach((el) => el.setAttribute("data-shown", "")),
      }),
  });
}

/** Fotoğraf çerçevesi ortadan açılır, fotoğraf yerine oturur (data-media); data-parallax: kaydırdıkça hafif kayar. */
function media(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>("[data-media]").forEach((frame) => {
    const img = frame.querySelector("img");
    const radius = getComputedStyle(frame).borderTopLeftRadius || "0px";
    const tl = gsap.timeline({
      delay: Number(frame.dataset.delay ?? 0),
      scrollTrigger: { trigger: frame, start: "top 90%", once: true },
      onComplete: () => {
        frame.setAttribute("data-shown", "");
        gsap.set(frame, { clearProps: "clipPath" });
      },
    });
    tl.to(frame, { clipPath: `inset(0% 0% 0% 0% round ${radius})`, duration: 1.5, ease: "expo.out" });
    if (img) tl.to(img, { scale: 1, duration: 1.8, ease: "expo.out" }, 0);
  });

  root.querySelectorAll<HTMLElement>("[data-parallax]").forEach((frame) => {
    const inner = frame.querySelector<HTMLElement>("[data-parallax-inner]") ?? frame.querySelector("img");
    if (!inner) return;
    gsap.fromTo(
      inner,
      { yPercent: -5 },
      { yPercent: 5, ease: "none", scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true } },
    );
  });
}

/** İnce çizgiler soldan uzar (data-draw). */
function lines(root: HTMLElement) {
  const items = root.querySelectorAll<HTMLElement>("[data-draw]");
  if (!items.length) return;
  ScrollTrigger.batch(items, {
    start: "top 94%",
    once: true,
    onEnter: (batch) => gsap.to(batch, { scaleX: 1, duration: 1.3, ease: "expo.out", stagger: 0.06 }),
  });
}

/** Tanıtım paragrafı: kaydırdıkça kelimeler griden koyuya döner (data-words). */
function words(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>("[data-words]").forEach((el) => {
    const split = SplitText.create(el, { type: "words", wordsClass: "w" });
    gsap.fromTo(
      split.words,
      { color: WORD_FROM },
      { color: WORD_TO, ease: "none", stagger: 0.12, scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 52%", scrub: 0.6 } },
    );
  });
}

/**
 * Süreç akışı (data-steps): ekranın ortasındaki adım etkin olur (data-active), yapışkan fotoğraf ona geçer, çizgi dolar.
 * Etkin adım işaretlemesi hareket kapalıyken de çalışır (renk değişimi hareket sayılmaz); çizginin dolması yalnız hareketle.
 */
function steps(root: HTMLElement, animate: boolean) {
  root.querySelectorAll<HTMLElement>("[data-steps]").forEach((flow) => {
    const items = gsap.utils.toArray<HTMLElement>("[data-step]", flow);
    const images = gsap.utils.toArray<HTMLElement>("[data-step-img]", flow);
    const activate = (index: number) => {
      items.forEach((el, i) => el.toggleAttribute("data-active", i === index));
      images.forEach((el, i) => el.toggleAttribute("data-active", i === index));
    };
    items.forEach((el, i) =>
      ScrollTrigger.create({
        trigger: el,
        start: "top 58%",
        end: "bottom 58%",
        onToggle: (self) => {
          if (self.isActive) activate(i);
        },
      }),
    );
    const fill = flow.querySelector<HTMLElement>("[data-steps-fill]");
    if (fill && animate) {
      gsap.fromTo(fill, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: items[0], endTrigger: items[items.length - 1], start: "top 58%", end: "bottom 58%", scrub: true } });
    }
    flow.dataset.stepsReady = "";
  });
}

/**
 * Bir sayfanın hareketini kurar (başlık, belirme, fotoğraf, çizgi, kelime, süreç), geri dönen fonksiyon söker.
 * Yeni sayfa en üstten açılır; başka sayfanın #bölüm bağlantısıyla gelindiyse o bölüme.
 */
function preparePage(root: HTMLElement): () => void {
  const hashTarget = location.hash.length > 1 ? document.querySelector<HTMLElement>(decodeURIComponent(location.hash)) : null;
  if (hashTarget) requestAnimationFrame(() => scrollToTarget(hashTarget, true));
  else lenis?.scrollTo(0, { immediate: true, force: true });

  if (prefersReducedMotion()) {
    const still = gsap.context(() => steps(root, false), root);
    return () => still.revert();
  }

  const ctx = gsap.context(() => {
    try {
      splitHeadings(root);
      reveals(root);
      media(root);
      lines(root);
      words(root);
      steps(root, true);
      // CSS'teki güvenlik animasyonu kapansın: başlangıç durumlarını artık GSAP yönetiyor
      root.dataset.motionReady = "";
    } catch (error) {
      // kurulum yarıda kaldıysa güvenlik animasyonu içeriği görünür yapsın
      delete root.dataset.motionReady;
      console.error(error);
    }
  }, root);

  // yazı tipi, görseller ya da açılan bölümler sayfanın boyunu değiştirince tetikleme konumları yenilensin;
  // yoksa sayfanın sonundaki öğeler eski konuma göre hiç görünmeyebilir
  const refresh = () => ScrollTrigger.refresh();
  let pending = 0;
  let lastHeight = root.offsetHeight;
  const resized = new ResizeObserver(() => {
    if (root.offsetHeight === lastHeight) return;
    lastHeight = root.offsetHeight;
    window.clearTimeout(pending);
    pending = window.setTimeout(refresh, REFRESH_DEBOUNCE_MS);
  });
  resized.observe(root);
  document.fonts?.ready.then(refresh);
  window.addEventListener("load", refresh);

  return () => {
    window.clearTimeout(pending);
    resized.disconnect();
    window.removeEventListener("load", refresh);
    ctx.revert();
  };
}

/**
 * Sitenin hareketi: Lenis yumuşak kaydırma + GSAP (ScrollTrigger, SplitText). Kabukta bir kez kurulur.
 * Sayfa değişimi adrese göre değil içerik alanına (contentId) yeni sayfa girdiği ana göre yakalanır: Next adresi yeni sayfa
 * gelmeden önce değiştirebiliyor; adrese bağlıyken eski sayfa sıfırlanıp en üste zıplıyor, sayfa yanıp sönüyordu (29.09).
 * Hareketi kapatan ziyaretçide hiçbir şey gizlenmez.
 */
export function Motion({ rootId, contentId }: { rootId: string; contentId: string }) {
  // Lenis bir kez; GSAP'in saatiyle çalışır ki ScrollTrigger aynı karede güncellensin
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const instance = new Lenis({ lerp: LENIS_LERP, autoRaf: false });
    lenis = instance;
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      lenis = null;
    };
  }, []);

  // sayfa içi bağlantılar (#bolum) kayarak gider; hedef odak alır, adres çubuğu güncellenir
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
      const link = (event.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href") ?? "";
      const target = id.length > 1 ? document.querySelector<HTMLElement>(id) : null;
      if (!target) return;
      event.preventDefault();
      scrollToTarget(target);
      history.pushState(null, "", id);
      if (!link.hasAttribute("data-konu")) {
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    const root = document.getElementById(rootId);
    const content = document.getElementById(contentId);
    if (!root || !content) return;
    let teardown = preparePage(root);
    // yeni sayfa içerik alanına girdi (mikro görev, çizimden önce): eskisini sök, yenisinin ilk ekranı hazır gelsin
    const observer = new MutationObserver((records) => {
      if (!records.some((r) => r.addedNodes.length > 0)) return;
      teardown();
      if (!location.hash) showFirstScreen(root);
      teardown = preparePage(root);
    });
    observer.observe(content, { childList: true });
    return () => {
      observer.disconnect();
      teardown();
    };
  }, [rootId, contentId]);

  return null;
}
