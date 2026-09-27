import { PORTAL_HREF } from "@/components/home/home-content";

// Yalnız doğrulanmış bilgiler. Ekip, tarihçe ve ofis fotoğrafı GoTech'ten gelince eklenecek.
export const WAYS = [
  {
    title: "Kurulumdan sonra destek",
    body: "Kurulumdan sonra da destek bizden. Uzak bağlantıyla, portaldan ya da e-postayla ulaşın.",
  },
  {
    title: "Kendi yazılım ekibimiz var",
    body: "Mikro'nun yetmediği yerde ek ekran, rapor ve entegrasyonları kendimiz geliştiriyoruz; kurumlara Mikro'dan bağımsız yazılım da yapıyoruz.",
    link: { href: "/yazilim-cozumleri", label: "Yazılım çözümleri" },
  },
  {
    title: "Kendi destek araçlarımız",
    body: "Talepleriniz destek portalında kayıt altında, kimin üstlendiğini oradan görürsünüz. Uzak bağlantıyı kendi uygulamamız GoTech Desk ile yapıyoruz.",
    link: { href: PORTAL_HREF, label: "Destek portalı" },
  },
  {
    title: "Mevcut kurulumunuzu devralıyoruz",
    body: "Mikro'yu başka bir iş ortağından aldıysanız desteği bize taşıyabilirsiniz. Lisansınız ve verileriniz sizde kalır, baştan başlamazsınız.",
    link: { href: "#iletisim", label: "Kurulumunuzu inceleyelim", konu: "gecis" },
  },
];
