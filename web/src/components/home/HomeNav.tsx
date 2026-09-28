"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MenuIcon } from "@/components/kurumsal/Icons";
import { GoTechLogoHeader } from "@/components/kurumsal/Logo";
import { PORTAL_HREF, SITE_NAV } from "./home-content";
import h from "./home.module.css";
import { Icon } from "./icons";
import { cx } from "./parts";

const STUCK_AFTER = 40;

/**
 * Sitenin tek üst menüsü (ana sayfa ve iç sayfalar): beyaz, yapışkan; sağda "Destek portalı" ve "Ücretsiz demo".
 * Ürünler ve Hizmetler'in altında açılır menü var: üstüne gelince ya da klavyeyle odaklanınca açılır (üst bağlantı sayfaya gider).
 * 1100px altında bağlantılar menü düğmesine iner, alt bağlantılar girintili listelenir. "Ücretsiz demo" her sayfanın sonundaki
 * iletişim formuna (#iletisim) iner, konuyu da seçili getirir (HomeEffects).
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

  return (
    <header ref={headerRef} className={cx(h.nav, stuck && h.stuck)} data-sticky-nav="">
      <div className={h.wrap}>
        <Link className={h.logo} href="/" aria-label="GoTech ana sayfa"><GoTechLogoHeader /></Link>
        <nav className={h.navLinks} aria-label="Ana menü">
          {SITE_NAV.map((link) => (
            <div key={link.href} className={h.navItem}>
              <Link className={h.navTop} href={link.href} aria-current={current(link.href)}>
                {link.label}
                {link.children && <Icon name="chevronDown" size={15} stroke={2} />}
              </Link>
              {link.children && (
                <div className={h.drop}>
                  {link.children.map((child) => (
                    <Link key={child.href} href={child.href}>
                      <b>{child.label}</b>
                      {child.note && <small>{child.note}</small>}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className={h.navActions}>
          <Link className={cx(h.btn, h.ghost, h.small, h.navPortal)} href={PORTAL_HREF}>Destek portalı</Link>
          <a className={cx(h.btn, h.small)} href="#iletisim" data-konu="demo" onClick={() => setOpen(false)}>Ücretsiz demo</a>
        </div>
        <button ref={buttonRef} className={h.menuBtn} type="button" aria-label="Menü" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(!open)}>
          <MenuIcon open={open} />
        </button>
      </div>
      {open && (
        <nav className={h.menu} id="site-menu" aria-label="Menü">
          <div className={h.wrap}>
            {SITE_NAV.map((link) => (
              <div key={link.href} className={h.menuGroup}>
                <Link href={link.href} aria-current={current(link.href)} onClick={() => setOpen(false)}>{link.label}</Link>
                {link.children && (
                  <div className={h.menuSub}>
                    {link.children.map((child) => (
                      <Link key={child.href} href={child.href} onClick={() => setOpen(false)}>{child.label}</Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link href={PORTAL_HREF} onClick={() => setOpen(false)}>Destek portalı</Link>
          </div>
        </nav>
      )}
    </header>
  );
}
