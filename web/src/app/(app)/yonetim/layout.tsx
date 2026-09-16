import type { ReactNode } from "react";
import { AppShell } from "@/components/app/AppShell";
import { countNewLeads } from "@/features/leads/queries";
import { countTicketsByStatus } from "@/features/tickets/queries";
import { requireStaff } from "@/lib/auth/session";

export default async function TeamPanelLayout({ children }: { children: ReactNode }) {
  const user = await requireStaff();
  const [counts, newLeads] = await Promise.all([countTicketsByStatus(), countNewLeads()]);

  return (
    <AppShell
      area="Yönetim paneli"
      user={user}
      cta={{ href: "/yonetim/faturalar/yeni", label: "Fatura kes" }}
      links={[
        { href: "/yonetim", label: "Genel bakış", icon: "home" },
        { href: "/yonetim/talep", label: "Destek talepleri", icon: "inbox", count: counts.open },
        { href: "/yonetim/basvurular", label: "Başvurular", icon: "form", count: newLeads },
        { href: "/yonetim/musteriler", label: "Müşteriler", icon: "building" },
        { href: "/yonetim/cihazlar", label: "Cihazlar", icon: "monitor" },
        { href: "/yonetim/projeler", label: "Projeler", icon: "folder" },
        { href: "/yonetim/faturalar", label: "Faturalar", icon: "receipt" },
        { href: "/yonetim/ekip", label: "Ekip", icon: "users" },
        { href: "/yonetim/mailler", label: "Giden mailler", icon: "mail" },
        { href: "/yonetim/hesap", label: "Hesabım", icon: "user" },
      ]}
    >
      {children}
    </AppShell>
  );
}
