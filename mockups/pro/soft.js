/* GoTech ana sayfa — hareket.
   Tek iş: içeriği yumuşakça getirmek. Zemin rengi değişmiyor, sayfa kilitlenmiyor,
   scroll'a bağlı hiçbir şey yok. Bir hareket en fazla 700ms, en fazla 18px yol. */

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const root = document.documentElement;
const EASE = "power2.out";
const mob = matchMedia("(max-width:760px)").matches;

if (matchMedia("(prefers-reduced-motion:reduce)").matches) {
  root.classList.remove("motion");
  root.classList.add("no-motion");
} else {
  // CSS failsafe'i devral: önce inline başlangıç, sonra sınıfı kaldır (yanıp sönme olmaz)
  gsap.set("[data-in]", { opacity: 0, y: 18 });
  root.classList.remove("motion");

  // hero: yukarıdan aşağı tek akış
  gsap.to(".hero [data-in]", { opacity: 1, y: 0, duration: .7, ease: EASE, stagger: .09, delay: .1 });

  // geri kalan her şey: göründüğünde bir kez
  ScrollTrigger.batch("[data-in]:not(.hero [data-in])", {
    start: mob ? "top 92%" : "top 86%",
    once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: .65, ease: EASE, stagger: .08, overwrite: "auto" }),
  });

  // nav: sadece gölge/çizgi
  const nav = document.querySelector(".nav");
  ScrollTrigger.create({ start: "top -8", end: 99999, onToggle: (s) => nav.classList.toggle("stuck", s.isActive) });

  Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2500))]).then(() => ScrollTrigger.refresh());
}
