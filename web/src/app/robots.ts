import type { MetadataRoute } from "next";

const SITE = process.env.SITE_URL || "http://localhost:3000";

// Kamuya açık site taransın; portal, panel ve indirme bağlantıları dışarıda kalsın.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/giris", "/panel", "/yonetim", "/kur", "/dosya", "/dokuman", "/sifre-belirle", "/sifremi-unuttum", "/indir", "/api"],
    },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
