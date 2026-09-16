"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "./Icon";

export type SideNavLink = { href: string; label: string; icon: IconName; count?: number };

const matches = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

export function SideNavLinks({ links }: { links: SideNavLink[] }) {
  const pathname = usePathname();
  // the most specific matching link wins, so /panel/talep/1004 highlights "/panel" but /panel/talep/yeni its own link
  const current = links.filter((l) => matches(pathname, l.href)).sort((a, b) => b.href.length - a.href.length)[0];

  return (
    <nav className="side-nav" aria-label="Panel menüsü">
      {links.map((link) => (
        <Link key={link.href} href={link.href} aria-current={link === current ? "page" : undefined}>
          <span className="w-icon"><Icon name={link.icon} size={18} /></span>
          {link.label}
          {Boolean(link.count) && <span className="count">{link.count}</span>}
        </Link>
      ))}
    </nav>
  );
}
