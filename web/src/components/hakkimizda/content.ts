import { PORTAL_HREF } from "@/components/home/home-content";

// Yalnız doğrulanmış bilgiler. Ekip, tarihçe ve ofis fotoğrafı GoTech'ten gelince eklenecek.
export const WAYS = [
  {
    title: "Satış sonrası destek",
    body: "Kurulumun ardından destek hizmetimiz devam eder. Uzak bağlantı, destek portalı ve e-posta kanallarından bize ulaşabilirsiniz.",
  },
  {
    title: "Kendi yazılım ekibimiz",
    body: "İşletmenize özel ek ekran, rapor ve entegrasyonlar Mikro ile entegre olarak kendi ekibimiz tarafından geliştirilir. Web, e-ticaret ve portal projeleri de yürütüyoruz.",
    link: { href: "/yazilim-cozumleri", label: "Yazılım çözümleri" },
  },
  {
    title: "Kendi destek altyapımız",
    body: "Talepleriniz destek portalında kayıt altına alınır; aşamasını ve sorumlusunu portaldan takip edersiniz. Uzak bağlantı, kendi uygulamamız GoTech Desk üzerinden sağlanır.",
    link: { href: PORTAL_HREF, label: "Destek portalı" },
  },
  {
    title: "Mevcut kurulumların devri",
    body: "Mikro'yu başka bir iş ortağından aldıysanız destek hizmetinizi GoTech'e devredebilirsiniz. Lisansınız ve verileriniz aynen korunur.",
    link: { href: "#iletisim", label: "Kurulumunuzu inceleyelim", konu: "gecis" },
  },
];
