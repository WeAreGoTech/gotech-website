import type { ReactNode } from "react";
import { SiteShell } from "@/components/site/shell/SiteShell";

// Site metinleri veritabanından okunuyor: sayfalar build anında dondurulmamalı.
export const dynamic = "force-dynamic";

/**
 * Kamuya açık sitenin bütün sayfaları (ana sayfa dahil) bu kabukta: aynı menü, alt bilgi ve hareket.
 * Menü ve alt bilgi sayfa değişince yerinde kalır, yalnız içerik geçiş yapar. Her sayfa iletişim bölümüyle biter.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
