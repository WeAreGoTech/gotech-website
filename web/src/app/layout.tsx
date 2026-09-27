import type { Metadata } from "next";
import { Figtree, Geologica } from "next/font/google";
// tokens.css globals'tan önce: değişkenler tanımlı olsun (tek tema, color-scheme:light)
import "./tokens.css";
import "./globals.css";

// Geologica: panel (globals.css). Figtree: kamuya açık site (ana sayfa + iç sayfalar), Mikro'nun Gilroy'una en yakın ücretsiz yazı.
const geologica = Geologica({ subsets: ["latin", "latin-ext"], variable: "--font-geologica", display: "swap" });
const figtree = Figtree({ subsets: ["latin", "latin-ext"], variable: "--font-figtree", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
  title: { default: "GoTech | Mikro Yazılım Yetkili İş Ortağı · İzmir", template: "%s | GoTech" },
  description: "Mikro Yazılım kurulumu, e-Dönüşüm, eğitim ve destek. 2017'den beri İzmir'de Mikro Yazılım yetkili iş ortağı.",
  icons: { icon: "/favicon.svg" },
  openGraph: { siteName: "GoTech", locale: "tr_TR", type: "website" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={`${geologica.variable} ${figtree.variable}`}>
      <body>{children}</body>
    </html>
  );
}
