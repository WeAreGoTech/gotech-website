"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { SiteSettings } from "./content";
import { MenuIcon } from "./Icons";
import { GoTechLogoHeader } from "./Logo";

const LINKS = [
  { href: "/urunler", label: "Ürünler" },
  { href: "/hizmetlerimiz", label: "Hizmetler" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

const telHref = (phone: string) => `tel:${phone.replace(/\s/g, "")}`;

export function SiteHeader({ settings }: { settings: SiteSettings }) {
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={stuck ? "nav stuck" : "nav"}>
      <div className="wrap">
        <Link className="logo" href="/" aria-label="GoTech ana sayfa">
          <GoTechLogoHeader />
        </Link>

        <nav className="nav-links">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={pathname === link.href ? "on" : undefined}>
              {link.label}
            </Link>
          ))}
        </nav>

        <a className="nav-phone" href={telHref(settings.salesPhone)}>{settings.salesPhone}</a>
        <Link className="btn btn-sm" href="/giris">Destek portalı</Link>

        <button type="button" className="nav-toggle" aria-label="Menü" aria-expanded={open} onClick={() => setOpen(!open)}>
          <MenuIcon open={open} />
        </button>
      </div>

      {open && (
        <nav className="nav-mobile">
          <div className="wrap">
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>
            ))}
            <a href={telHref(settings.salesPhone)}>Satış {settings.salesPhone}</a>
            <Link className="btn" href="/giris" onClick={() => setOpen(false)}>Destek portalı</Link>
          </div>
        </nav>
      )}
    </header>
  );
}
