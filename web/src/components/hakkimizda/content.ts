import { PORTAL_HREF } from "@/components/home/home-content";

// Yalnız doğrulanmış bilgiler. Ekip, tarihçe ve ofis fotoğrafı GoTech'ten gelince eklenecek.
export const WAYS = [
  {
    title: "Kurulumdan sonra destek",
    body: "Kurulum bittikten sonra da destek veriyoruz. Bize uzak bağlantıyla, destek portalından ya da e-postayla ulaşabilirsiniz.",
  },
  {
    title: "Kendi yazılım ekibimiz var",
    body: "İşletmenize özel ek ekran, rapor ve entegrasyonları Mikro'ya bağlı olarak kendimiz geliştiriyoruz. Mikro'dan bağımsız yazılım projeleri de yapıyoruz.",
    link: { href: "/yazilim-cozumleri", label: "Yazılım çözümleri" },
  },
  {
    title: "Kendi destek araçlarımız",
    body: "Talepleriniz destek portalında kayıt altına alınır; hangi aşamada olduğunu ve kimin ilgilendiğini oradan takip edersiniz. Uzak bağlantı için kendi uygulamamız GoTech Desk'i kullanıyoruz.",
    link: { href: PORTAL_HREF, label: "Destek portalı" },
  },
  {
    title: "Mevcut kurulumunuzu devralıyoruz",
    body: "Mikro'yu başka bir iş ortağından aldıysanız desteğinizi bize taşıyabilirsiniz. Lisansınız ve verileriniz olduğu gibi kalır.",
    link: { href: "#iletisim", label: "Kurulumunuzu inceleyelim", konu: "gecis" },
  },
];
