import type { Metadata } from "next";
import { Contact } from "@/components/site/ui/Contact";
import { PageHero } from "@/components/site/ui/PageHero";
import { getSiteConfig } from "@/features/site-content/queries";

export const metadata: Metadata = {
  title: "İletişim",
  description: "GoTech ile iletişime geçin: keşif görüşmesi ve demo için formu doldurun ya da e-posta gönderin. Alsancak, İzmir.",
};

/** İletişim: kısa giriş ve form (formun konusu menüdeki "Demo isteyin" gibi bağlantılarla seçili gelir). */
export default async function IletisimPage() {
  const { settings, content } = await getSiteConfig();
  const reach = settings.salesPhone ? "bizi arayın" : `${settings.email} adresine yazın`;

  return (
    <main>
      <PageHero
        crumbs={[{ href: "/iletisim", label: "İletişim" }]}
        title="Bize ulaşın"
        lede={`Formu doldurun ya da ${reach}. ${settings.workingHours} arasında dönüş yapıyoruz.`}
      />
      <Contact
        settings={settings}
        content={content}
        title="Bize yazın"
        lead="Ne kullandığınızı ve neye ihtiyacınız olduğunu kısaca anlatın; doğru kişi size dönsün."
      />
    </main>
  );
}
