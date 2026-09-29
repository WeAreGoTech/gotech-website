/* eslint-disable @next/next/no-img-element -- site IIS arkasında next start ile çalışıyor; görseller public/'ten olduğu gibi */
import type { SiteContent } from "@/components/kurumsal/content";
import { MikroLogo } from "@/components/kurumsal/Logo";
import { HOME_HERO } from "../content";
import { Arrow } from "../ui/icons";
import { cx, Label, typo } from "../ui/parts";
import s from "./home.module.css";

/**
 * Giriş: kim olduğumuz (etiket), ne yaptığımız (başlık ve metin panelden), güven (Mikro logosu ve Silver rozetleri).
 * Altında geniş fotoğraf ortadan açılır, kaydırdıkça hafifçe kayar.
 */
export function Hero({ content }: { content: SiteContent }) {
  const { image } = HOME_HERO;

  return (
    <section className={s.hero}>
      <div className="wrap">
        <Label>{HOME_HERO.label}</Label>
        <h1 className={cx("display", s.heroTitle)} data-split="">{typo(content.heroTitle)}</h1>

        <div className={s.heroRow}>
          <div className={s.heroCopy}>
            <p className="lede" data-reveal="" data-delay=".15">{content.heroLead}</p>
            <div className="actions" data-reveal="" data-delay=".25">
              <a className="btn" href="#iletisim" data-konu="demo">Demo isteyin <Arrow /></a>
              <a className="btn btn-line" href="#urunler">Hangisi size uygun?</a>
            </div>
          </div>

          <div className={s.partner} data-reveal="" data-delay=".35">
            <MikroLogo className={s.mikro} />
            <div className={s.partnerText}>
              <span className={s.badges}>
                <img src="/images/jumper-silver.png" alt="Jumper Silver Partner" width={297} height={233} />
                <img src="/images/flyer-silver.png" alt="Flyer Silver Partner" width={324} height={247} />
              </span>
              <p>Mikro Yazılım yetkili iş ortağı<br />Jumper ve Flyer Silver Partner</p>
            </div>
          </div>
        </div>

        <figure className={cx("media", s.heroPhoto)} data-media="" data-delay=".2" data-parallax="">
          <img src={image.src} alt={image.alt} width={image.width} height={image.height} fetchPriority="high" />
        </figure>
      </div>
    </section>
  );
}
