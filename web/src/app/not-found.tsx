import type { Metadata } from "next";
import { PageMessage } from "@/components/home/PageMessage";

export const metadata: Metadata = { title: "Sayfa bulunamadı", robots: { index: false, follow: false } };

/**
 * Sitenin 404'ü: ziyaretçi siteden buraya düştüğü için sitenin dilinde (panelin kart dili değil).
 * Panel içindeki 404 ayrı: app/(app)/not-found.tsx.
 */
export default function NotFound() {
  return (
    <PageMessage
      title="Aradığınız sayfa yok"
      text="Bağlantı değişmiş ya da yanlış yazılmış olabilir. Aşağıdan devam edebilirsiniz."
      links={[
        { href: "/", label: "Ana sayfa" },
        { href: "/urunler", label: "Ürünler" },
        { href: "/iletisim", label: "İletişim" },
      ]}
    />
  );
}
