import Link from "next/link";
import type { SiteSettings } from "@/components/kurumsal/content";
import { ArrowIcon } from "@/components/kurumsal/Icons";
import { MIGRATION, MIGRATION_TOPIC, PORTAL_HREF, SUPPORT } from "./home-content";
import h from "./home.module.css";
import { cx, IconCard, REVEAL, SectionHead, telHref } from "./parts";
import s from "./sections.module.css";

/** Mikro'yu zaten kullananlar: iş ortağı değişikliği, V16 geçişi, özel rapor/ekranlar. */
export function Migration() {
  return (
    <section className={cx(h.sec, h.ground)} id="gecis">
      <div className={h.wrap}>
        <SectionHead eyebrow="Mevcut Mikro kullanıcıları" title="Mikro'yu zaten kullanıyor musunuz?" lede="Baştan başlamanız gerekmiyor. Mevcut kurulumunuzu inceleyip oradan devam ediyoruz." />
        <div className={cx(s.grid, s.cols3)}>
          {MIGRATION.map((item) => <IconCard key={item.title} {...item} />)}
        </div>
        <div className={s.cta} {...REVEAL}>
          {/* data-konu: formda "Mevcut Mikro kurulumu / geçiş" konusu seçili gelir (HomeEffects) */}
          <a className={h.btn} href="#iletisim" data-konu={MIGRATION_TOPIC}>Kurulumunuzu inceleyelim <ArrowIcon /></a>
          <span>Görüşme için ücret almıyoruz.</span>
        </div>
      </div>
    </section>
  );
}

/** Destek: dört eşit kart. Destek hattı numarası panelden (Site ayarları > Destek telefonu). */
export function Support({ settings }: { settings: SiteSettings }) {
  const [line, remote, onsite, portal] = SUPPORT;
  return (
    <section className={h.sec} id="destek">
      <div className={h.wrap}>
        <SectionHead center eyebrow="Destek" title="Kurulumdan sonra da yanınızdayız" lede="Desteği sistemi kuran ekip veriyor. Nasıl ulaşırsanız ulaşın, talebiniz aynı ekibe gider." />
        <div className={cx(s.grid, s.cols4)}>
          <IconCard {...line} action={<a className={s.cardAct} href={telHref(settings.supportPhone)}>{settings.supportPhone}</a>} />
          <IconCard {...remote} />
          <IconCard {...onsite} />
          <IconCard {...portal} action={<Link className={s.cardAct} href={PORTAL_HREF}>Portala giriş <ArrowIcon /></Link>} />
        </div>
      </div>
    </section>
  );
}
