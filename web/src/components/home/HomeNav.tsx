"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MenuIcon } from "@/components/kurumsal/Icons";
import { GoTechLogoHeader } from "@/components/kurumsal/Logo";
import { NAV_LINKS, PORTAL_HREF } from "./home-content";
import h from "./home.module.css";
import { cx } from "./parts";

const STUCK_AFTER = 40;

/** Yapışkan üst menü: sayfa kayınca ince çizgi alır; 1100px altında menü düğmesine döner. */
export function HomeNav() {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > STUCK_AFTER);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={cx(h.nav, stuck && h.stuck)} data-sticky-nav="">
      <div className={h.wrap}>
        <Link className={h.logo} href="/" aria-label="GoTech ana sayfa"><GoTechLogoHeader /></Link>
        <nav className={h.navLinks} aria-label="Ana menü">
          {NAV_LINKS.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
        </nav>
        <Link className={h.navPortal} href={PORTAL_HREF}>Destek portalı</Link>
        <a className={cx(h.btn, h.small, h.navCta)} href="#iletisim" data-konu="demo">Ücretsiz demo</a>
        <button className={h.menuBtn} type="button" aria-label="Menü" aria-expanded={open} aria-controls="home-menu" onClick={() => setOpen(!open)}>
          <MenuIcon open={open} />
        </button>
      </div>
      {open && (
        <nav className={h.menu} id="home-menu" aria-label="Menü">
          <div className={h.wrap}>
            {NAV_LINKS.map((link) => <a key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</a>)}
            <Link href={PORTAL_HREF}>Destek portalı</Link>
          </div>
        </nav>
      )}
    </header>
  );
}
