"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MenuIcon } from "@/components/kurumsal/Icons";
import { GoTechLogoHeader, GoTechLogoWhite } from "@/components/kurumsal/Logo";
import { PORTAL_HREF, SITE_NAV } from "./home-content";
import h from "./home.module.css";
import { cx } from "./parts";

const STUCK_AFTER = 40;

/** Girişi tam ekran fotoğrafla açan sayfalar: menü fotoğrafın üstünde, saydam ve beyaz başlar. */
const OVER_HERO = new Set(["/yazilim-cozumleri"]);

/**
 * Sitenin tek üst menüsü (ana sayfa ve iç sayfalar): sayfa kayınca ince çizgi alır; 1100px altında menü düğmesine döner.
 * "Ücretsiz demo" her sayfanın sonundaki iletişim formuna (#iletisim) iner, konuyu da seçili getirir (HomeEffects).
 */
export function HomeNav() {
  const pathname = usePathname();
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);
  const headerRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  // sayfa değişince menü kapalı gelsin (render sırasında: effect içinde setState yok)
  if (openedAt !== pathname) {
    setOpenedAt(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > STUCK_AFTER);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // açık menü Escape'le ya da dışına tıklanınca kapanır
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    const onPointer = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const current = (href: string) => (pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined);

  // fotoğrafın üstündeyken: sayfa kaydırılmamış ve menü kapalıysa saydam; sonra normal beyaz menü
  const overRoute = OVER_HERO.has(pathname);
  const over = overRoute && !stuck && !open;

  return (
    <header ref={headerRef} className={cx(h.nav, overRoute && h.navFixed, over && h.navOver, stuck && h.stuck)} data-sticky-nav="">
      <div className={h.wrap}>
        <Link className={h.logo} href="/" aria-label="GoTech ana sayfa">{over ? <GoTechLogoWhite /> : <GoTechLogoHeader />}</Link>
        <nav className={h.navLinks} aria-label="Ana menü">
          {SITE_NAV.map((link) => <Link key={link.href} href={link.href} aria-current={current(link.href)}>{link.label}</Link>)}
        </nav>
        <Link className={h.navPortal} href={PORTAL_HREF}>Destek portalı</Link>
        <a className={cx(h.btn, h.small, h.navCta)} href="#iletisim" data-konu="demo" onClick={() => setOpen(false)}>Ücretsiz demo</a>
        <button ref={buttonRef} className={h.menuBtn} type="button" aria-label="Menü" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(!open)}>
          <MenuIcon open={open} />
        </button>
      </div>
      {open && (
        <nav className={h.menu} id="site-menu" aria-label="Menü">
          <div className={h.wrap}>
            {SITE_NAV.map((link) => (
              <Link key={link.href} href={link.href} aria-current={current(link.href)} onClick={() => setOpen(false)}>{link.label}</Link>
            ))}
            <Link href={PORTAL_HREF} onClick={() => setOpen(false)}>Destek portalı</Link>
          </div>
        </nav>
      )}
    </header>
  );
}
