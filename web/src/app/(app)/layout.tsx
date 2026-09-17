import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/components/app/app.css";
import "@/components/app/ticket.css";
import "@/components/app/modules.css";
import "@/components/app/desk.css";
import "@/components/app/attachments.css";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function AppLayout({ children }: { children: ReactNode }) {
  return children;
}
