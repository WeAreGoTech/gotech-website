import type { SiteContent, SiteSettings } from "@/components/kurumsal/content";
import { CONTACT_DEFAULT, mapsHref } from "../content";
import f from "./contact.module.css";
import { LeadForm } from "./LeadForm";
import { Head, telHref } from "./parts";

type Props = {
  settings: SiteSettings;
  content: SiteContent;
  // başlık ve açıklama varsayılanı panelden (Site içeriği > Kapanış)
  title?: string;
  lead?: string;
  submitLabel?: string;
};

/**
 * Her sayfanın sonundaki iletişim bölümü (id="iletisim"): menüdeki ve sayfadaki "demo" bağlantıları buraya iner.
 * Solda başlık ve iletişim bilgileri (telefon yalnız panelden girildiyse), sağda gerçek başvuru formu.
 */
export function Contact({ settings, content, title, lead, submitLabel }: Props) {
  return (
    <section className="sec" id="iletisim">
      <div className="wrap">
        <div className={f.panel}>
          <div className={f.copy}>
            <Head label={CONTACT_DEFAULT.label} title={title ?? content.ctaTitle} lede={lead ?? content.ctaLead} />
            <dl className={f.info} data-reveal="">
              {settings.salesPhone && <div><dt>Satış</dt><dd><a href={telHref(settings.salesPhone)}>{settings.salesPhone}</a></dd></div>}
              {settings.supportPhone && <div><dt>Destek</dt><dd><a href={telHref(settings.supportPhone)}>{settings.supportPhone}</a></dd></div>}
              <div><dt>E-posta</dt><dd><a href={`mailto:${settings.email}`}>{settings.email}</a></dd></div>
              <div><dt>Çalışma saatleri</dt><dd>{settings.workingHours}</dd></div>
              <div>
                <dt>Adres</dt>
                <dd>{settings.address}</dd>
                <dd><a href={mapsHref(settings.address)} target="_blank" rel="noopener noreferrer">Haritada açın</a></dd>
              </div>
            </dl>
          </div>
          <div className={f.card} data-reveal="">
            <LeadForm submitLabel={submitLabel} />
            <p className={f.note}>{CONTACT_DEFAULT.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
