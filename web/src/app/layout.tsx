import type { Metadata } from "next";
import { Geologica } from "next/font/google";
import "./globals.css";

const geologica = Geologica({ subsets: ["latin", "latin-ext"], variable: "--font-geologica", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
  title: { default: "GoTech | Mikro ERP, web sitesi ve yönetim paneli", template: "%s | GoTech" },
  description: "Mikro ERP, web sitesi ve yönetim paneli. Tasarımından kurulumuna tek ekip.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={geologica.variable}>
      <body>{children}</body>
    </html>
  );
}
