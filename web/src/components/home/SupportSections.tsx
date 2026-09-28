import Link from "next/link";
import type { SiteSettings } from "@/components/kurumsal/content";
import { ArrowIcon } from "@/components/kurumsal/Icons";
import { PORTAL_HREF, SUPPORT_CHANNELS } from "./home-content";
import h from "./home.module.css";
import { cx, REVEAL, SectionHead, telHref } from "./parts";
import s from "./sections.module.css";

/**
 * Destek: kanal, ne zaman, nasıl. Telefon satırı yalnız numara panelden girilince görünür (Site ayarları > Destek telefonu).
 */
export function Support({ settings }: { settings: SiteSettings }) {
  const phone = settings.supportPhone;
  return (
    <section className={h.sec} id="destek">
      <div className={cx(h.wrap, s.support)}>
        <SectionHead
          eyebrow="Destek"
          title="Kurulum sonrası destek"
          lede={`Destek ekibimiz ${settings.workingHours.toLocaleLowerCase("tr")} arasında çalışıyor.`}
        />
        <ul className={s.channels}>
          {phone && (
            <li {...REVEAL}>
              <b>Destek hattı</b>
              <span className={s.when}>{settings.workingHours}</span>
              <span><a className={s.act} href={telHref(phone)}>{phone}</a></span>
            </li>
          )}
          {SUPPORT_CHANNELS.map((c) => (
            <li key={c.title} {...REVEAL}>
              <b>{c.title}</b>
              <span className={s.when}>{c.when || settings.workingHours}</span>
              <span>
                {c.body}
                {c.title === "Destek portalı" && <Link className={s.act} href={PORTAL_HREF}>Portala giriş <ArrowIcon /></Link>}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
