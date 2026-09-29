/* eslint-disable @next/next/no-img-element -- site IIS arkasında next start ile çalışıyor; görseller public/'ten olduğu gibi */
import type { SiteContent } from "@/components/kurumsal/content";
import { MikroLogo } from "@/components/kurumsal/Logo";
import { HOME_HERO, SERVICES_HERO } from "@/components/site/content";
import { Arrow } from "@/components/site/ui/icons";
import { Label, typo } from "@/components/site/ui/parts";
import { PlusReveal } from "./PlusReveal";
import s from "./stage.module.css";

/**
 * Giriş: ekranı dolduran fotoğraf sahnesi (+ imiyle açılır). Kim olduğumuz ve ne yaptığımız fotoğrafın sol altına oyulmuş
 * beyaz sekmede; güven (Mikro logosu, Silver rozetleri) sağ alttaki sekmede, Mikro kılavuzundaki gibi beyaz zeminde ve köşede.
 */
export function Stage({ content }: { content: SiteContent }) {
  return (
    <section className={s.hero} aria-labelledby="vitrin-baslik">
      <div className={s.stage}>
        <PlusReveal image={SERVICES_HERO.image} />

        <div className={`${s.tab} ${s.tabMain}`}>
          <Label>{HOME_HERO.label}</Label>
          <h1 id="vitrin-baslik" className={s.title} data-split="" data-delay=".9">{typo(content.heroTitle)}</h1>
          <div className="actions" data-reveal="" data-delay="1.1">
            <a className="btn" href="#iletisim" data-konu="demo">Demo isteyin <Arrow /></a>
            <a className="btn btn-line" href="#urunler">Hangisi size uygun?</a>
          </div>
        </div>

        <div className={`${s.tab} ${s.tabTrust}`} data-reveal="" data-delay="1.3">
          <MikroLogo className={s.mikro} />
          <span className={s.badges}>
            <img src="/images/jumper-silver.png" alt="Jumper Silver Partner" width={297} height={233} />
            <img src="/images/flyer-silver.png" alt="Flyer Silver Partner" width={324} height={247} />
          </span>
          <p>Mikro Yazılım<br />yetkili iş ortağı</p>
        </div>
      </div>
    </section>
  );
}
