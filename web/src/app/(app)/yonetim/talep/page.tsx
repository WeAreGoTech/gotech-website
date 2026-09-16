import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState, PageHeader } from "@/components/app/AppShell";
import { TicketList } from "@/components/app/TicketList";
import { countTicketsByStatus, listStaffTickets, type StaffFilter } from "@/features/tickets/queries";
import { requireStaff } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Destek talepleri" };

// Turkish query values in the address bar, mapped to the internal filter names.
const FILTERS: { param: string; filter: StaffFilter; label: string }[] = [
  { param: "aktif", filter: "active", label: "Kapanmamış" },
  { param: "acik", filter: "open", label: "Açık" },
  { param: "islemde", filter: "in_progress", label: "İşlemde" },
  { param: "musteride", filter: "waiting_customer", label: "Müşteri yanıtı bekleniyor" },
  { param: "kapali", filter: "closed", label: "Kapandı" },
  { param: "tumu", filter: "all", label: "Tümü" },
];

export default async function TeamTicketsPage({ searchParams }: PageProps<"/yonetim/talep">) {
  await requireStaff();
  const { durum } = await searchParams;
  const current = FILTERS.find((f) => f.param === durum) ?? FILTERS[0];
  const [tickets, counts] = await Promise.all([listStaffTickets(current.filter), countTicketsByStatus()]);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const countFor = (filter: StaffFilter) => (filter === "all" ? total : filter === "active" ? total - counts.closed : counts[filter]);

  return (
    <>
      <PageHeader title="Destek talepleri" description="Müşterilerin açtığı talepler. Yeni talepler ve müşteri yanıtları e-posta ile de bildirilir." />
      <nav className="tabs" aria-label="Duruma göre filtrele">
        {FILTERS.map((f) => (
          <Link key={f.param} href={`/yonetim/talep?durum=${f.param}`} aria-current={f === current ? "page" : undefined}>
            {f.label}<b>{countFor(f.filter)}</b>
          </Link>
        ))}
      </nav>
      {tickets.length > 0 ? (
        <TicketList audience="staff" rows={tickets} />
      ) : (
        <EmptyState title="Bu filtrede talep yok" text="Başka bir durum seçin ya da tüm taleplere bakın." action={<Link className="btn btn-ghost" href="/yonetim/talep?durum=tumu">Tüm talepler</Link>} />
      )}
    </>
  );
}
