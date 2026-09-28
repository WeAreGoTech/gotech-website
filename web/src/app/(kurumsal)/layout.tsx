import type { ReactNode } from "react";
import { HomeFooter } from "@/components/home/ContactSection";
import { HomeEffects } from "@/components/home/HomeEffects";
import h from "@/components/home/home.module.css";
import { HomeNav } from "@/components/home/HomeNav";
import "@/components/kurumsal/kurumsal.css";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { getSiteConfig } from "@/features/site-content/queries";

// Site metinleri veritabanından okunuyor: sayfalar build anında dondurulmamalı.
export const dynamic = "force-dynamic";

const ROOT_ID = "site";

/**
 * İç sayfaların kabuğu ana sayfayla aynı: aynı kök (home.module.css .home: renkler, yazı, butonlar), aynı üst menü ve
 * alt bilgi. Sayfalara özel bölümler kurumsal.css'te ama aynı değişkenlerle çiziliyor. Her sayfa iletişim kartıyla biter.
 */
export default async function SiteLayout({ children }: { children: ReactNode }) {
  const { settings, content } = await getSiteConfig();

  return (
    <div id={ROOT_ID} className={`${h.home} site`}>
      <SmoothScroll />
      <HomeEffects rootId={ROOT_ID} />
      <a className="skip" href="#icerik">İçeriğe geç</a>
      <HomeNav />
      <div id="icerik">{children}</div>
      <HomeFooter settings={settings} content={content} />
    </div>
  );
}
