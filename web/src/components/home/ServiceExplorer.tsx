"use client";

/* eslint-disable @next/next/no-img-element -- site IIS arkasında next start ile çalışıyor; görseller public/'ten olduğu gibi */
import { useEffect, useState } from "react";
import type { ServiceTab } from "./home-content";
import h from "./home.module.css";
import { cx, PageLink } from "./parts";
import sv from "./services.module.css";

// stok fotoğrafların boyutu (public/images/stok)
const IMG = { width: 960, height: 640 };
const panelId = (id: string) => `hizmet-${id}`;

/**
 * Hizmetler: solda hizmet listesi (seçilen açılır, sol kenarda kırmızı çizgi), sağda seçilen hizmetin fotoğrafı.
 * Kalıp SAP ve Siemens ana sayfalarından. Kendiliğinden ilerlemez; seçim kullanıcıda.
 * Her maddenin id'si sayfa içi bağlantı: #edonusum gibi bir bağlantı (SmoothScroll maddeye odaklanır) ya da adresteki # o hizmeti açar.
 * Dar ekranda fotoğraf açılan maddenin içinde görünür.
 */
export function ServiceExplorer({ tabs }: { tabs: ServiceTab[] }) {
  const [active, setActive] = useState(0);

  // adres #destek gibi bir hizmetle açıldıysa ya da sonradan öyle değiştiyse o hizmet açılsın
  useEffect(() => {
    const sync = () => {
      const i = tabs.findIndex((t) => `#${t.id}` === location.hash);
      if (i >= 0) setActive(i);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [tabs]);

  return (
    <div className={sv.explorer}>
      <ul className={sv.list}>
        {tabs.map((tab, i) => {
          const on = i === active;
          return (
            <li key={tab.id} id={tab.id} className={cx(sv.item, on && sv.on)} onFocus={(e) => e.target === e.currentTarget && setActive(i)}>
              <h3>
                <button type="button" className={sv.head} aria-expanded={on} aria-controls={panelId(tab.id)} onClick={() => setActive(i)}>
                  {tab.label}
                  <span className={sv.chev} aria-hidden="true" />
                </button>
              </h3>
              {/* açılıp kapanma: dış kutu satır yüksekliğini 0fr ↔ 1fr arasında geçirir, iç kutu taşanı gizler */}
              <div id={panelId(tab.id)} className={sv.panel} inert={!on}>
                <div className={sv.clip}>
                  <div className={sv.body}>
                    <img className={sv.inlineImg} src={tab.image} alt="" width={IMG.width} height={IMG.height} loading="lazy" />
                    <p>{tab.body}</p>
                    <ul className={cx(sv.ticks, tab.items.length > 4 && sv.cols)}>
                      {tab.items.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                    {tab.link && <PageLink className={h.link} link={tab.link} arrow />}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      {/* fotoğraflar hizmeti süsler, bilgi taşımaz: ekran okuyucuya gösterilmez */}
      <div className={sv.media} aria-hidden="true">
        {tabs.map((tab, i) => (
          <img key={tab.id} className={cx(i === active && sv.on)} src={tab.image} alt="" width={IMG.width} height={IMG.height} loading="lazy" />
        ))}
      </div>
    </div>
  );
}
