import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Conversation } from "@/components/app/Conversation";
import { TicketDevices } from "@/components/app/device-detail";
import { RatingStars } from "@/components/app/rating";
import { DetailRows, StatusStepper, TicketHeader } from "@/components/app/ticket-detail";
import { Composer, StaffTicketForm } from "@/components/app/ticket-forms";
import { getDeviceView, listDevices } from "@/features/devices/queries";
import { replyAsStaff, updateTicketAsStaff } from "@/features/tickets/actions";
import { getStaffTicket, listStaffMembers, listTicketMessages } from "@/features/tickets/queries";
import { requireStaff } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Destek talebi" };

export default async function TeamTicketPage({ params }: PageProps<"/yonetim/talep/[number]">) {
  const user = await requireStaff();
  const number = Number((await params).number);
  const row = Number.isInteger(number) ? await getStaffTicket(number) : null;
  if (!row) notFound();

  const { ticket } = row;
  const [messages, staff, companyDevices] = await Promise.all([
    listTicketMessages(ticket.id, { includeInternal: true }),
    listStaffMembers(),
    listDevices(ticket.companyId),
  ]);
  // the computer may have been moved to another company since the ticket was opened
  const ticketDevice = ticket.deviceId
    ? (companyDevices.devices.find((d) => d.id === ticket.deviceId) ?? (await getDeviceView(ticket.deviceId))?.device ?? null)
    : null;

  return (
    <>
      <TicketHeader ticket={ticket} audience="staff" backHref="/yonetim/talep" extra={row.companyName} />
      <StatusStepper status={ticket.status} audience="staff" createdAt={ticket.createdAt} updatedAt={ticket.updatedAt} />
      <div className="t-layout">
        <section className="convo" aria-label="Mesajlar">
          <Conversation messages={messages} viewerId={user.id} viewerRole="staff" />
          <Composer action={replyAsStaff.bind(null, ticket.number)} allowInternal />
        </section>
        <aside className="t-side">
          <StaffTicketForm
            action={updateTicketAsStaff.bind(null, ticket.number)}
            status={ticket.status}
            priority={ticket.priority}
            assigneeId={ticket.assigneeId}
            staff={staff}
          />
          <TicketDevices
            ticketNumber={ticket.number}
            device={ticketDevice}
            others={companyDevices.devices.filter((d) => d.id !== ticket.deviceId)}
            statusKnown={companyDevices.statusKnown}
          />
          <DetailRows
            title="Müşteri"
            compact
            rows={[
              ["Firma", row.companyName],
              ["Açan", row.creatorName],
              ["E-posta", <a key="mail" href={`mailto:${row.creatorEmail}`}>{row.creatorEmail}</a>],
              ...(ticket.rating ? ([["Puan", <RatingStars key="rating" rating={ticket.rating} />]] as [string, ReactNode][]) : []),
            ]}
          >
            {ticket.ratingComment && <p className="drows-note">&ldquo;{ticket.ratingComment}&rdquo;</p>}
          </DetailRows>
        </aside>
      </div>
    </>
  );
}
