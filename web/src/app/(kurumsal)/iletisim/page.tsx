import type { Metadata } from "next";
import { Contact } from "@/components/home/ContactSection";
import { PageHeader } from "@/components/kurumsal/PageHeader";
import { getSiteConfig } from "@/features/site-content/queries";

export const metadata: Metadata = {
  title: "İletişim",
  description: "GoTech ile iletişime geçin: ücretsiz keşif görüşmesi ve demo için formu doldurun ya da e-posta gönderin. Alsancak, İzmir.",
};

export default async function IletisimPage() {
  const { settings, content } = await getSiteConfig();
  const reach = settings.salesPhone ? "bizi arayın" : `${settings.email} adresine yazın`;

  return (
    <main>
      <PageHeader
        eyebrow="İletişim"
        title="Bize ulaşın"
        lead={`Formu doldurun ya da ${reach}. ${settings.workingHours} arasında dönüş yapıyoruz.`}
      />
      <Contact
        settings={settings}
        content={content}
        title="Bize yazın"
        lead="Ne kullandığınızı ve neye ihtiyacınız olduğunu kısaca anlatın; doğru kişi size dönsün."
        submitLabel="Mesajı gönderin"
      />
    </main>
  );
}
