import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState, PageHeader } from "@/components/app/AppShell";
import { Icon } from "@/components/app/Icon";
import { TicketList } from "@/components/app/TicketList";
import { listCompanyTickets } from "@/features/tickets/queries";
import { requireCustomer } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Destek talepleri" };

export default async function CustomerTicketsPage() {
  const user = await requireCustomer();
  const tickets = await listCompanyTickets(user.companyId);
  const ongoing = tickets.filter((t) => t.status !== "closed");
  const closed = tickets.filter((t) => t.status === "closed");
  const newTicket = <Link className="btn" href="/panel/talep/yeni"><Icon name="plus" size={18} />Yeni talep</Link>;

  return (
    <>
      <PageHeader title="Destek talepleri" description="Firmanızdan açılan tüm talepler ve son durumları." actions={tickets.length > 0 && newTicket} />
      {tickets.length === 0 ? (
        <EmptyState title="Henüz talep açmadınız" text="Bir sorun yaşadığınızda ya da yeni bir isteğiniz olduğunda buradan yazın. Yanıtladığımızda e-posta ile haber veririz." action={newTicket} />
      ) : (
        <>
          {ongoing.length > 0 && (
            <section className="w-group">
              <h2 className="w-group-title">Devam edenler</h2>
              <TicketList rows={ongoing} audience="customer" />
            </section>
          )}
          {closed.length > 0 && (
            <section className="w-group">
              <h2 className="w-group-title">Kapananlar</h2>
              <TicketList rows={closed} audience="customer" />
            </section>
          )}
        </>
      )}
    </>
  );
}
