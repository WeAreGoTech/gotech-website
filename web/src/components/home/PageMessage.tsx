import Link from "next/link";
import type { ReactNode } from "react";
import { GoTechLogoHeader } from "@/components/kurumsal/Logo";
import h from "./home.module.css";
import { cx } from "./parts";

export type PageMessageLink = { href: string; label: string };

type Props = {
  title: string;
  text: string;
  /** İlk bağlantı dolgulu buton, diğerleri çerçeveli. */
  links: PageMessageLink[];
  /** Hata kodu gibi küçük alt satır. */
  note?: ReactNode;
  /** Bağlantılardan önce gelen düğme (ör. "Yeniden dene"); istemci tarafından verilir. */
  action?: ReactNode;
};

/**
 * Sitenin dilinde tek mesajlı sayfa: 404 ve hata sınırları için. Panelin kart dilini kullanmıyor,
 * çünkü ziyaretçi siteden buraya düşüyor (UI-TASARIM.md T4). Sunucu verisi istemez: hata
 * sınırları istemci bileşeni olduğu için alt bilgi ve iletişim bilgisi burada yok.
 */
export function PageMessage({ title, text, links, note, action }: Props) {
  return (
    <div className={h.home}>
      <div className={h.wrap}>
        <header style={{ paddingBlock: "26px" }}>
          <Link className={h.logo} href="/" aria-label="GoTech ana sayfa">
            <GoTechLogoHeader />
          </Link>
        </header>
        <main id="icerik" className={h.sec}>
          <div className={h.head}>
            <h1>{title}</h1>
            <p className={h.lede}>{text}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 6 }}>
              {action}
              {links.map((link, i) => (
                <Link className={!action && i === 0 ? h.btn : cx(h.btn, h.ghost)} key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
            {note && <p style={{ marginTop: 10, fontSize: ".86rem", color: "var(--ink-3)" }}>{note}</p>}
          </div>
        </main>
      </div>
    </div>
  );
}
