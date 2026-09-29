"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cx } from "@/components/home/parts";
import { MenuIcon } from "@/components/kurumsal/Icons";
import { GoTechLogoHeader } from "@/components/kurumsal/Logo";
import { NAV, PORTAL_HREF } from "../content";
import { Chevron } from "../ui/icons";
import { lockScroll } from "./Motion";
import s from "./shell.module.css";

// menü, sayfa bu kadar kaydırılmadan saklanmaz (girişte hep görünsün)
const HIDE_AFTER = 360;
const MIN_DELTA = 6;

/**
 * Üst menü: aşağı kaydırınca çekilir, yukarı kaydırınca geri gelir. Ürünler ve Hizmetler'in altında açılır liste
 * (üstüne gelince ya da klavyeyle odaklanınca). 1100px altında tam ekran menü. "Demo isteyin" sayfanın sonundaki
 * iletişim formuna iner ve konuyu seçili getirir (Prefill).
 */
export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);
  const [stuck, setStuck] = useState(false);
  const [hidden, setHidden] = useState(false);
  // dar ekran menüsü üst bandın altından başlasın: açılırken ölçülür
  const [sheetTop, setSheetTop] = useState(0);
  const headerRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // sayfa değişince menü kapalı gelsin (render sırasında, effect'te setState yok)
  if (openedAt !== pathname) {
    setOpenedAt(pathname);
    setOpen(false);
  }

  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setStuck(y > 8);
      if (Math.abs(y - last) < MIN_DELTA) return;
      setHidden(y > last && y > HIDE_AFTER);
      last = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    lockScroll(open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lockScroll(false);
    };
  }, [open]);

  const current = (href: string) => (pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined);
  const toggle = () => {
    setSheetTop(headerRef.current?.getBoundingClientRect().bottom ?? 0);
    setOpen(!open);
  };

  return (
    <header
      ref={headerRef}
      className={cx(s.nav, stuck && s.stuck, hidden && !open && s.hidden)}
      style={{ viewTransitionName: "gt-nav" }}
      data-nav=""
    >
      <div className={cx("wrap", s.bar)}>
        <Link className={s.logo} href="/" aria-label="GoTech ana sayfa">
          <GoTechLogoHeader />
        </Link>

        <nav className={s.links} aria-label="Ana menü">
          {NAV.map((link) => (
            <div key={link.href} className={s.item}>
              <Link href={link.href} aria-current={current(link.href)}>
                {link.label}
                {link.children && <Chevron />}
              </Link>
              {link.children && (
                <div className={s.drop}>
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

        <div className={s.end}>
          <Link className={s.portal} href={PORTAL_HREF}>Destek portalı</Link>
          <a className={cx("btn btn-sm", s.cta)} href="#iletisim" data-konu="demo" onClick={() => setOpen(false)}>
            Demo isteyin
          </a>
          <button
            ref={buttonRef}
            className={s.menuBtn}
            type="button"
            aria-label={open ? "Menüyü kapat" : "Menü"}
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={toggle}
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </div>

      {open && (
        <nav className={s.sheet} id="site-menu" aria-label="Menü" style={{ "--sheet-top": `${sheetTop}px` } as CSSProperties}>
          <div className={cx("wrap", s.sheetIn)}>
            {NAV.map((link, i) => (
              <div key={link.href} className={s.group} style={{ "--i": i } as CSSProperties}>
                <Link href={link.href} aria-current={current(link.href)} onClick={() => setOpen(false)}>{link.label}</Link>
                {link.children && (
                  <div className={s.sub}>
                    {link.children.map((child) => (
                      <Link key={child.href} href={child.href} onClick={() => setOpen(false)}>{child.label}</Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className={s.sheetEnd}>
              <a className="btn" href="#iletisim" data-konu="demo" onClick={() => setOpen(false)}>Demo isteyin</a>
              <Link className="tlink" href={PORTAL_HREF} onClick={() => setOpen(false)}>Destek portalı</Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
