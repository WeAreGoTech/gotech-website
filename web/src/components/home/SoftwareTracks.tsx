/* eslint-disable @next/next/no-img-element -- site IIS arkasında next start ile çalışıyor; görseller public/'ten olduğu gibi */
import { SOFTWARE_TRACKS } from "@/components/kurumsal/referanslar";
import h from "./home.module.css";
import { cx, REVEAL } from "./parts";
import sw from "./software.module.css";

// stok fotoğrafların boyutu (public/images/stok)
const IMG = { width: 960, height: 640 };

/**
 * Yazılım işlerimizin iki türü (Mikro'ya bağlı / bağımsız): üstte fotoğraf, altında ne yaptığımız ve iş listesi.
 * Ana sayfada (compact) yalnız iş adları, /yazilim-cozumleri'de açıklamalarıyla. Zemini gri bölümde durur: kartlar beyaz.
 */
export function SoftwareTracks({ compact = false }: { compact?: boolean }) {
  return (
    <div className={sw.tracks}>
      {SOFTWARE_TRACKS.map((track) => (
        <article key={track.id} id={compact ? undefined : track.id} className={sw.track} {...REVEAL}>
          <img className={sw.photo} src={track.image} alt="" width={IMG.width} height={IMG.height} loading="lazy" />
          <div className={sw.body}>
            <span className={h.eyebrow}>{track.tag}</span>
            <h3>{track.title}</h3>
            <p className={sw.lead}>{track.body}</p>
            <ul className={cx(sw.items, compact && sw.compact)}>
              {track.items.map((item) => (
                <li key={item.title}>
                  <b>{item.title}</b>
                  {!compact && <span>{item.body}</span>}
                </li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </div>
  );
}
