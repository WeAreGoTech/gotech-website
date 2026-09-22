"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { NAV_LINKS } from "./content";
import { getLenis, useScrollFrame } from "./scroll-frame";

const NAV_PROBE_Y = 36;

export function SiteNav() {
  const navRef = useRef<HTMLElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Solid once the hero is behind it; light or dark depending on the section underneath.
  useScrollFrame(() => {
    const nav = navRef.current;
    const hero = document.querySelector(".hero-flow");
    if (!nav || !hero) return;
    nav.classList.toggle("is-solid", hero.getBoundingClientRect().bottom <= NAV_PROBE_Y);
    const under = [...document.querySelectorAll<HTMLElement>("[data-nav-tone]")].find((section) => {
      const r = section.getBoundingClientRect();
      return r.top <= NAV_PROBE_Y && r.bottom > NAV_PROBE_Y;
    });
    if (under) nav.dataset.tone = under.dataset.navTone;
  });

  useEffect(() => {
    const lenis = getLenis();
    if (menuOpen) lenis?.stop();
    else lenis?.start();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    menuBtnRef.current?.focus();
  };

  return (
    <>
      <header ref={navRef} className={`nav${menuOpen ? " is-menu-open" : ""}`} data-tone="dark">
        <a className="logo" href="#top" aria-label="GoTech ana sayfa">
          {/* eslint-disable-next-line @next/next/no-img-element -- static SVG */}
          <img className="logo-light" src="/brand/gotech-logo.svg" alt="" width={180} height={58} />
          {/* eslint-disable-next-line @next/next/no-img-element -- static SVG */}
          <img className="logo-dark" src="/brand/gotech-logo-dark.svg" alt="" width={180} height={58} />
        </a>
        <nav className="nav-links" aria-label="Ana menü">
          {NAV_LINKS.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
          <Link className="nav-login" href="/giris">Müşteri girişi</Link>
        </nav>
        <a className="btn btn-small nav-cta" href="#iletisim">Teklif iste</a>
        <button ref={menuBtnRef} className="menu-btn" type="button" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen((o) => !o)}>
          {menuOpen ? "Kapat" : "Menü"}
        </button>
      </header>
      <div className="mobile-menu" id="mobile-menu" hidden={!menuOpen}>
        <nav aria-label="Mobil menü" onClick={closeMenu}>
          {NAV_LINKS.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
          <Link href="/giris">Müşteri girişi</Link>
        </nav>
        <a className="btn btn-signal" href="#iletisim" onClick={closeMenu}>Teklif iste</a>
      </div>
    </>
  );
}
