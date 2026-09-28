"use client";

/* eslint-disable @next/next/no-img-element -- site IIS arkasında next start ile çalışıyor; görseller public/'ten olduğu gibi */
import { type CSSProperties, type KeyboardEvent, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ProductLogo } from "@/components/kurumsal/ProductLogo";
import { HERO_IMAGE, type HeroSlide } from "./home-content";
import h from "./home.module.css";
import { cx, PageLink } from "./parts";
import sl from "./slider.module.css";

// her slayt ekranda bu kadar kalır (ms); sekme çubuğunda etkin sekmenin çizgisi bu sürede dolar
const SLIDE_MS = 7000;
// parmakla bu kadar kaydırınca slayt değişir (px)
const SWIPE_PX = 40;
const tabId = (key: string) => `slayt-${key}-sekme`;
const panelId = (key: string) => `slayt-${key}`;

// hareket tercihi: sunucuda "açık" varsayılır, tarayıcıda gerçek tercih okunur ve değişirse güncellenir
const REDUCE = "(prefers-reduced-motion: reduce)";
const subscribeReduce = (onChange: () => void) => {
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};
const useReducedMotion = () => useSyncExternalStore(subscribeReduce, () => window.matchMedia(REDUCE).matches, () => false);

function PauseIcon({ paused }: { paused: boolean }) {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="currentColor">
      {paused ? <path d="M4.5 2.5v11l9-5.5z" /> : <path d="M4 2.5h2.8v11H4zM9.2 2.5H12v11H9.2z" />}
    </svg>
  );
}

/**
 * Ana sayfa hero'su: yumuşak gri panelde slaytlar, altta slayt adlarıyla sekme çubuğu (mikro.com.tr ve Logo Yazılım'daki kalıp).
 * Her slaytta başlık, metin, butonlar ve görsel birlikte değişir. İlk slaydın başlığı sayfanın h1'i.
 * Kendiliğinden ilerler; üstüne gelince, odakta, ekran dışında ya da sekme arkadayken durur. Hareket kapalıysa ilerlemez.
 */
export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const count = slides.length;
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  // kullanıcı durdur düğmesine basana kadar hareket tercihi geçerli
  const [choice, setChoice] = useState<boolean | null>(null);
  const userPaused = choice ?? reduced;
  const [held, setHeld] = useState(false);
  const [hidden, setHidden] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const swipeFrom = useRef<number | null>(null);
  const go = (i: number) => setActive((i + count) % count);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let offscreen = false;
    const sync = () => setHidden(offscreen || document.hidden);
    const io = new IntersectionObserver(([entry]) => {
      offscreen = !entry.isIntersecting;
      sync();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  const onTabKey = (e: KeyboardEvent, i: number) => {
    const moves: Record<string, number> = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: count - 1 };
    if (!(e.key in moves)) return;
    e.preventDefault();
    const next = (moves[e.key] + count) % count;
    go(next);
    document.getElementById(tabId(slides[next].key))?.focus();
  };

  return (
    <section
      ref={rootRef}
      className={cx(sl.hero, (userPaused || held || hidden) && sl.paused)}
      style={{ "--dur": `${SLIDE_MS}ms` } as CSSProperties}
      aria-roledescription="carousel"
      aria-label="Öne çıkanlar"
      onPointerEnter={(e) => e.pointerType === "mouse" && setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setHeld(false)}
    >
      <div className={h.wrap}>
        <div
          className={sl.stage}
          onPointerDown={(e) => (swipeFrom.current = e.clientX)}
          onPointerUp={(e) => {
            const dx = swipeFrom.current === null ? 0 : e.clientX - swipeFrom.current;
            swipeFrom.current = null;
            if (Math.abs(dx) > SWIPE_PX) go(active + (dx < 0 ? 1 : -1));
          }}
        >
          {slides.map((slide, i) => {
            const on = i === active;
            const Title = i === 0 ? "h1" : "h2";
            return (
              <div
                key={slide.key}
                id={panelId(slide.key)}
                className={cx(sl.slide, on && sl.on)}
                role="tabpanel"
                aria-roledescription="slayt"
                aria-labelledby={tabId(slide.key)}
                inert={!on}
              >
                <div className={sl.copy}>
                  {slide.productId && <ProductLogo id={slide.productId} name={slide.label} />}
                  <span className={sl.eyebrow}>{slide.eyebrow}</span>
                  <Title className={sl.title}>{slide.title}</Title>
                  <p className={sl.lede}>{slide.lede}</p>
                  <div className={sl.actions}>
                    <PageLink className={h.btn} link={slide.cta} arrow />
                    {slide.more && <PageLink className={h.link} link={slide.more} />}
                  </div>
                </div>
                <div className={sl.media}>
                  {/* ilk görsel ilk karede görünür (LCP); diğerleri tembel yüklenir */}
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    width={HERO_IMAGE.width}
                    height={HERO_IMAGE.height}
                    fetchPriority={i === 0 ? "high" : undefined}
                    loading={i === 0 ? undefined : "lazy"}
                    draggable={false}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className={sl.bar}>
          <div className={sl.tabs} role="tablist" aria-label="Öne çıkanlar" style={{ "--n": count } as CSSProperties}>
            {slides.map((slide, i) => (
              <button
                key={slide.key}
                type="button"
                role="tab"
                id={tabId(slide.key)}
                aria-selected={i === active}
                aria-controls={panelId(slide.key)}
                tabIndex={i === active ? 0 : -1}
                className={cx(sl.tab, i === active && sl.on)}
                onClick={() => go(i)}
                onKeyDown={(e) => onTabKey(e, i)}
              >
                <span className={sl.track} aria-hidden="true">
                  {i === active && <i key={active} onAnimationEnd={() => go(active + 1)} />}
                </span>
                <span className={sl.label}>{slide.label}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            className={sl.pause}
            onClick={() => setChoice(!userPaused)}
            aria-label={userPaused ? "Slaytları oynat" : "Slaytları durdur"}
            title={userPaused ? "Oynat" : "Durdur"}
          >
            <PauseIcon paused={userPaused} />
          </button>
        </div>
      </div>
    </section>
  );
}
