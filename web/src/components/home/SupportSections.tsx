import Link from "next/link";
import type { SiteSettings } from "@/components/kurumsal/content";
import { ArrowIcon } from "@/components/kurumsal/Icons";
import { PORTAL_HREF, SUPPORT_CHANNELS } from "./home-content";
import h from "./home.module.css";
import { Icon, type IconName } from "./icons";
import { cx, REVEAL, SectionHead, telHref } from "./parts";
import s from "./sections.module.css";

type Channel = { icon: IconName; title: string; when: string; body: string; href?: string };

/**
 * Destek: kanal kartları (ikon, ad, ne zaman, nasıl) ve portal butonu. Telefon kartı yalnız numara panelden girilince görünür
 * (Site ayarları > Destek telefonu); çalışma saatleri de panelden.
 */
export function Support({ settings }: { settings: SiteSettings }) {
  const phone = settings.supportPhone;
  const channels: Channel[] = [
    ...(phone ? [{ icon: "phone" as const, title: "Destek hattı", when: settings.workingHours, body: phone, href: telHref(phone) }] : []),
    ...SUPPORT_CHANNELS.map((c) => ({ ...c, when: c.when || settings.workingHours })),
  ];
  return (
    <section className={h.sec} id="destek">
      <div className={h.wrap}>
        <div className={s.supportTop}>
          <SectionHead
            eyebrow="Destek"
            title="Kurulum sonrası"
            accent="destek"
            lede={`Destek ekibimiz ${settings.workingHours.toLocaleLowerCase("tr")} arasında çalışıyor. Talepleriniz destek portalında kayıt altında.`}
          />
          <Link className={h.btn} href={PORTAL_HREF} {...REVEAL}>Destek portalına giriş <ArrowIcon /></Link>
        </div>
        <ul className={s.channels}>
          {channels.map((c) => (
            <li key={c.title} className={cx(h.card, s.channel)} {...REVEAL}>
              <span className={h.iconBox}><Icon name={c.icon} size={24} /></span>
              <h3>{c.title}</h3>
              <span className={s.when}>{c.when}</span>
              <p>{c.href ? <a href={c.href}>{c.body}</a> : c.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
