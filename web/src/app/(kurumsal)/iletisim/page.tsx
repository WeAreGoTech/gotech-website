import type { Metadata } from "next";
import { ContactForm } from "@/components/kurumsal/ContactForm";
import { PageHeader } from "@/components/kurumsal/PageHeader";
import { getSiteConfig } from "@/features/site-content/queries";

export const metadata: Metadata = {
  title: "İletişim",
  description: "GoTech ERP Solutions ile iletişime geçin: satış ve teknik destek telefonları, adres ve iletişim formu.",
};

const telHref = (phone: string) => `tel:${phone.replace(/\s/g, "")}`;

export default async function IletisimPage() {
  const { settings } = await getSiteConfig();

  return (
    <main>
      <PageHeader
        eyebrow="İletişim"
        title="Size nasıl"
        accent="yardımcı olabiliriz"
        titleAfter="?"
        lead="Formu doldurun ya da doğrudan arayın. Ücretsiz demo ve danışmanlık için hattımız açık."
      />

      <section className="sec">
        <div className="wrap contact">
          <dl className="contact-list">
            <div>
              <dt>Satış</dt>
              <dd>
                <a href={telHref(settings.salesPhone)}>{settings.salesPhone}</a>
              </dd>
            </div>
            <div>
              <dt>Destek</dt>
              <dd>
                <a href={telHref(settings.supportPhone)}>{settings.supportPhone}</a>
              </dd>
            </div>
            <div>
              <dt>E-posta</dt>
              <dd>
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </dd>
            </div>
            <div>
              <dt>Adres</dt>
              <dd>{settings.address}</dd>
            </div>
            <div>
              <dt>Çalışma saatleri</dt>
              <dd>{settings.workingHours}</dd>
            </div>
          </dl>

          <div>
            <span className="tag">Bize yazın</span>
            <h2 className="d3" style={{ marginTop: 14, marginBottom: 28 }}>Formu doldurun, size dönelim.</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
