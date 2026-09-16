import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Conversation } from "@/components/app/Conversation";
import { RatingForm, RatingStars } from "@/components/app/rating";
import { DetailRows, StatusStepper, TicketHeader } from "@/components/app/ticket-detail";
import { Composer } from "@/components/app/ticket-forms";
import { closeTicketAsCustomer, rateTicket, replyAsCustomer } from "@/features/tickets/actions";
import { PRIORITY_LABELS } from "@/features/tickets/labels";
import { getCompanyTicket, listTicketMessages } from "@/features/tickets/queries";
import { requireCustomer } from "@/lib/auth/session";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Destek talebi" };

export default async function CustomerTicketPage({ params }: PageProps<"/panel/talep/[number]">) {
  const user = await requireCustomer();
  const number = Number((await params).number);
  const ticket = Number.isInteger(number) ? await getCompanyTicket(number, user.companyId) : null;
  if (!ticket) notFound();

  const messages = await listTicketMessages(ticket.id, { includeInternal: false });
  const closed = ticket.status === "closed";

  return (
    <>
      <TicketHeader ticket={ticket} audience="customer" backHref="/panel/talep" />
      <StatusStepper status={ticket.status} audience="customer" createdAt={ticket.createdAt} updatedAt={ticket.updatedAt} />
      <div className="t-layout">
        <section className="convo" aria-label="Mesajlar">
          <Conversation messages={messages} viewerId={user.id} viewerRole="customer" />
          <Composer action={replyAsCustomer.bind(null, ticket.number)} closed={closed} />
        </section>
        <aside className="t-side">
          {closed && !ticket.rating && <RatingForm action={rateTicket.bind(null, ticket.number)} />}
          <DetailRows
            compact
            rows={[
              ["Öncelik", PRIORITY_LABELS[ticket.priority]],
              ["Son hareket", formatDateTime(ticket.updatedAt)],
              ...(ticket.rating ? ([["Değerlendirmeniz", <RatingStars key="rating" rating={ticket.rating} />]] as [string, ReactNode][]) : []),
            ]}
          >
            {!closed && (
              <form action={closeTicketAsCustomer.bind(null, ticket.number)} style={{ marginTop: 18 }}>
                <button className="btn btn-ghost" type="submit" style={{ width: "100%" }}>Sorunum çözüldü, kapat</button>
              </form>
            )}
          </DetailRows>
        </aside>
      </div>
    </>
  );
}
