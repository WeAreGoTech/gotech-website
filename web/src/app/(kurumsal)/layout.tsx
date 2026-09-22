import type { ReactNode } from "react";
import { Footer } from "@/components/kurumsal/Footer";
import "@/components/kurumsal/kurumsal.css";
import { SiteHeader } from "@/components/kurumsal/SiteHeader";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { getSiteConfig } from "@/features/site-content/queries";

// Site metinleri veritabanından okunuyor: sayfalar build anında dondurulmamalı.
export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const { settings, content } = await getSiteConfig();

  return (
    <>
      <SmoothScroll />
      <SiteHeader settings={settings} />
      {children}
      <Footer settings={settings} content={content} />
    </>
  );
}
