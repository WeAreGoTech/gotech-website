import type { ReactNode } from "react";
import { AppShell } from "@/components/app/AppShell";
import { getCompanyName } from "@/features/customers/queries";
import { requireCustomer } from "@/lib/auth/session";

export default async function CustomerPanelLayout({ children }: { children: ReactNode }) {
  const user = await requireCustomer();
  const companyName = await getCompanyName(user.companyId);

  return (
    <AppShell
      area={companyName || "Müşteri paneli"}
      user={user}
      cta={{ href: "/panel/talep/yeni", label: "Yeni talep" }}
      links={[
        { href: "/panel", label: "Genel bakış", icon: "home" },
        { href: "/panel/talep", label: "Destek talepleri", icon: "inbox" },
        { href: "/panel/projeler", label: "Projeler", icon: "folder" },
        { href: "/panel/faturalar", label: "Faturalar", icon: "receipt" },
        { href: "/panel/dokumanlar", label: "Dokümanlar", icon: "file" },
        { href: "/panel/uzak-destek", label: "Uzak Destek", icon: "monitor" },
        { href: "/panel/ekip", label: "Ekibim", icon: "users" },
        { href: "/panel/hesap", label: "Hesabım", icon: "user" },
      ]}
    >
      {children}
    </AppShell>
  );
}
