import type { Metadata } from "next";
import { Geologica } from "next/font/google";

const geologica = Geologica({ subsets: ["latin", "latin-ext"], variable: "--font-geologica", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
  title: { default: "GoTech ERP Solutions | Mikro Yazılım İş Ortağı", template: "%s | GoTech" },
  description: "Mikro Yazılım İş Ortağı olarak 2017'den beri işletmelere ERP çözümleri sunuyoruz. Mikro Run, Jump, Fly ve Müşavir; e-Dönüşüm, kurulum, eğitim ve 7/24 teknik destek.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={geologica.variable}>
      <body>{children}</body>
    </html>
  );
}
