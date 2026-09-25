import type { MetadataRoute } from "next";
import { PRODUCT_DETAILS } from "@/components/kurumsal/urun-detay";

const SITE = process.env.SITE_URL || "http://localhost:3000";
const PAGES = ["", "/urunler", "/hizmetlerimiz", "/yazilim-cozumleri", "/hakkimizda", "/iletisim"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [...PAGES, ...PRODUCT_DETAILS.map((p) => `/urunler/${p.slug}`)].map((path) => ({
    url: `${SITE}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : path.startsWith("/urunler") ? 0.9 : 0.7,
  }));
}
