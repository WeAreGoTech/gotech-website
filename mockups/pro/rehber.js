/* REHBER — etkileşim + hareket.
   Etkileşimler (ürün bulucu, SSS, form, duyuru) hareket kapalıyken de çalışır.
   Hareket: Lenis, hero girişi (satır maskesi), yol haritası çizgisi, bölümlerin bir kez belirmesi.
   Pin yok, snap yok, paralaks yok, zemin rengi değişmez. */

const root = document.documentElement;
const reduced = matchMedia("(prefers-reduced-motion:reduce)").matches;
const E = { in: "power3.out", big: "expo.out", soft: "power2.out" };
let lenis = null;
/* yenilemede sayfa baştan açılsın; hero animasyonu başlangıç konumuna göre kurulu */
if ("scrollRestoration" in history) history.scrollRestoration = "manual";

/* ================= ÜRÜN BULUCU: tek cümle + genişleyen raf =================
   Öneri üreticinin karşılaştırma tablosuna dayanıyor (urunler-data.ts COMPARISON):
   üretim Run'da yok · çoklu şirket yalnız Fly'da. */
const NAME = { run: "Mikro Run", jump: "Mikro Jump", fly: "Mikro Fly", musavir: "Mikro Müşavir" };
const BASE = {
  run: "1–5 çalışanlı işletmeler için tasarlandı",
  jump: "5–50 çalışanlı işletmeler için tasarlandı",
  fly: "50'den fazla çalışanı olan, grup yapısındaki işletmeler için",
};
const EXTRA = {
  run: "e-Dönüşüm paketi ürünün içinde geliyor",
  jump: "Basic ve bulut sürümleri de var",
  fly: "tam entegre kurumsal ERP platformu",
};

function pick(kim, uretim, coklu) {
  if (kim === "musavir") return { key: "musavir", why: ["Mali müşavirlere özel ürün", "defter beyan, mükellef yönetimi ve e-SMM bir arada"] };
  const bySize = { "1-5": "run", "5-50": "jump", "50+": "fly" }[kim];
  let key = bySize;
  const why = [];
  if (coklu && key !== "fly") { key = "fly"; why.push("birden fazla şirketi tek yerden yönetmek yalnız Fly'da var"); }
  if (uretim && key === "run") { key = "jump"; why.push("üretim modülü Run'da yok, Jump'ta var"); }
  if (key === bySize) why.unshift(BASE[key]);
  else why.unshift(`çalışan sayınıza göre ${NAME[bySize]} yeterdi`);
  if (uretim && !why.some((w) => w.startsWith("üretim"))) why.push("üretim modülü dahil");
  if (why.length < 2) why.push(EXTRA[key]);
  why[0] = why[0][0].toUpperCase() + why[0].slice(1);
  return { key, why };
}

(() => {
  const form = document.querySelector(".say");
  const shelf = document.querySelector(".shelf");
  if (!form || !shelf) return;
  const prods = [...shelf.querySelectorAll(".prod")];
  const whyEl = document.querySelector(".why");
  const selects = [...form.querySelectorAll("select")];
  const narrow = matchMedia("(max-width:900px)");

  /* hap genişliği seçili seçeneğin yazısına göre (yerel select en uzun seçeneğe göre genişler) */
  const probe = document.createElement("span");
  probe.style.cssText = "position:absolute;visibility:hidden;white-space:pre;pointer-events:none";
  document.body.append(probe);
  const size = (sel) => {
    const cs = getComputedStyle(sel);
    /* font kısaltması Firefox'ta boş dönebiliyor: parçaları tek tek kopyala */
    ["fontFamily", "fontSize", "fontWeight", "fontStyle", "letterSpacing"].forEach((k) => { probe.style[k] = cs[k]; });
    probe.textContent = sel.options[sel.selectedIndex].text;
    const pad = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    sel.style.width = Math.ceil(probe.getBoundingClientRect().width + pad + 2) + "px";
  };
  const sizeAll = () => selects.forEach(size);

  const open = (key) => prods.forEach((p) => {
    const on = p.dataset.p === key;
    p.classList.toggle("is-open", on);
    p.querySelector(".prod-head").setAttribute("aria-expanded", String(on));
  });

  const update = (animate) => {
    const kim = form.elements.kim.value;
    form.classList.toggle("is-musavir", kim === "musavir");
    const { key, why } = pick(kim, form.elements.uretim.value === "1", form.elements.sirket.value === "n");
    prods.forEach((p) => p.classList.toggle("is-rec", p.dataset.p === key));
    open(key);
    const paint = () => {
      whyEl.querySelector("b").textContent = `Neden ${NAME[key]}?`;
      whyEl.querySelector("span").textContent = why.join(" · ");
    };
    if (!animate || reduced || !window.gsap) { paint(); return; }
    gsap.to(whyEl, { opacity: 0, y: -6, duration: .18, overwrite: true, onComplete: () => {
      paint();
      gsap.fromTo(whyEl, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .5, ease: E.in, clearProps: "opacity,transform" });
    } });
  };

  form.addEventListener("change", (e) => { size(e.target); update(true); });
  prods.forEach((p) => p.querySelector(".prod-head").addEventListener("click", () => {
    if (p.classList.contains("is-open")) return;
    open(p.dataset.p);
    if (narrow.matches && lenis) setTimeout(() => lenis.scrollTo(p, { offset: -90 }), 250);
  }));

  sizeAll();
  update(false);
  document.fonts?.ready.then(sizeAll);
  addEventListener("resize", sizeAll);
})();

/* ================= DUYURU BANDI =================
   Tarihe bağlı: kalan gün yazılır, son gün geçince metin "sona erdi"ye döner.
   Gün farkı takvim günüyle (saat farkı yuvarlamayı kaydırmasın). */
(() => {
  const notice = document.querySelector(".notice[data-end]");
  if (!notice) return;
  const [y, m, d] = notice.dataset.end.split("-").map(Number);
  const now = new Date();
  const days = Math.round((Date.UTC(y, m - 1, d) - Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())) / 864e5);
  const main = notice.querySelector(".n-main");
  if (days > 1) main.textContent = `V16 desteği 15 Ekim 2026'da bitiyor: ${days} gün kaldı.`;
  else if (days >= 0) main.textContent = days ? "V16 desteği yarın bitiyor." : "V16 desteği bugün bitiyor.";
  else {
    main.textContent = "V16 desteği 15 Ekim 2026'da sona erdi.";
    notice.querySelector(".n-more").textContent = " Geçişi hâlâ planlayabiliriz.";
  }
})();
document.querySelector(".notice-x")?.addEventListener("click", (e) => {
  e.currentTarget.closest(".notice").hidden = true;
  window.ScrollTrigger?.refresh();
});

/* forma götüren butonlar konuyu seçili getirir (ör. "Kurulumunuzu inceleyelim" -> geçiş) */
document.querySelectorAll("[data-konu]").forEach((a) => a.addEventListener("click", () => {
  const konu = document.querySelector('#cform select[name="konu"]');
  if (konu) konu.value = a.dataset.konu;
}));

/* ================= FORM (mockup: gönderim yok, teşekkür notu) ================= */
document.querySelector("#cform")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const f = e.currentTarget;
  if (!f.reportValidity()) return;
  f.querySelector(".form-ok").hidden = false;
  f.reset();
});

/* ================= SSS: hareket açıksa yükseklik animasyonu, değilse yerel <details> ================= */
if (!reduced && window.gsap) {
  document.querySelectorAll(".faq details").forEach((d) => {
    const body = d.querySelector(".faq-a");
    d.querySelector("summary").addEventListener("click", (e) => {
      e.preventDefault();
      if (d.open) {
        d.classList.add("is-closing");
        gsap.to(body, { height: 0, duration: .42, ease: "power2.inOut", overwrite: true, onComplete: () => {
          d.open = false; d.classList.remove("is-closing"); gsap.set(body, { clearProps: "height" }); ScrollTrigger.refresh();
        } });
      } else {
        d.open = true;
        gsap.fromTo(body, { height: 0 }, { height: "auto", duration: .55, ease: E.in, overwrite: true, onComplete: () => {
          gsap.set(body, { clearProps: "height" }); ScrollTrigger.refresh();
        } });
      }
    });
  });
}

/* ================= HAREKET ================= */
if (reduced || !window.gsap) {
  root.classList.remove("motion");
  root.classList.add("no-motion");
  document.querySelectorAll(".step").forEach((s) => s.classList.add("on"));
} else {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  if (window.Lenis) {
    lenis = new Lenis({ lerp: .09 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach((a) => a.addEventListener("click", (e) => {
      const t = document.querySelector(a.getAttribute("href"));
      if (!t) return;
      e.preventDefault();
      lenis.scrollTo(t, { offset: -80 });
    }));
  }

  /* CSS failsafe'i devral: önce inline başlangıç, sonra sınıfı kaldır */
  const lines = gsap.utils.toArray(".h-lines .l > span");
  gsap.set("[data-in]", { opacity: 0, y: 18 });
  /* y:0 şart: CSS failsafe'teki translateY(110%)'u GSAP ilk okumada px olarak y'ye yazıyor;
     sıfırlanmazsa yPercent 0'a dönse de satır maskenin altında kalır */
  gsap.set(lines, { y: 0, yPercent: 110 });
  root.classList.remove("motion");

  /* ---------- hero ---------- */
  gsap.timeline({ defaults: { ease: E.in } })
    .to(".hero .eyebrow", { opacity: 1, y: 0, duration: .6 }, 0)
    .to(lines, { yPercent: 0, duration: 1, ease: E.big, stagger: .1 }, .1)
    .to(".hero-ph", { opacity: 1, y: 0, duration: 1.1, ease: E.soft }, .25)
    .to([".hero .lede", ".hero-cta", ".hero-trust"], { opacity: 1, y: 0, duration: .8, stagger: .08 }, .5);

  /* ---------- yol haritası: çizgi dolar, adımlar sırayla yanar ---------- */
  const steps = gsap.utils.toArray(".step");
  if (!matchMedia("(max-width:1100px)").matches) {
    gsap.to(".road-fill", {
      scaleX: 1, ease: "none",
      scrollTrigger: {
        trigger: ".road", start: "top 78%", end: "bottom 52%", scrub: .5,
        onUpdate: (s) => steps.forEach((st, i) => st.classList.toggle("on", s.progress >= i / (steps.length - 1) - .02)),
      },
    });
  } else {
    ScrollTrigger.create({ trigger: ".road", start: "top 80%", once: true,
      onEnter: () => steps.forEach((st, i) => setTimeout(() => st.classList.add("on"), i * 140)) });
  }

  /* ---------- kalan her şey: göründüğünde bir kez ---------- */
  ScrollTrigger.batch("[data-in]:not(.hero [data-in])", {
    start: "top 88%", once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: .8, ease: E.in, stagger: .07, overwrite: "auto", clearProps: "opacity,transform" }),
  });

  const nav = document.querySelector(".nav");
  ScrollTrigger.create({ start: "top -40", end: 99999, onToggle: (s) => nav.classList.toggle("stuck", s.isActive) });

  Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2000))]).then(() => ScrollTrigger.refresh());
}
