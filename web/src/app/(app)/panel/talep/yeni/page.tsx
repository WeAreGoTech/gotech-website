import type { Metadata } from "next";
import { PageHeader } from "@/components/app/AppShell";
import { NewTicketForm } from "@/components/app/ticket-forms";
import { NEW_TICKET_CATEGORIES } from "@/features/tickets/labels";

export const metadata: Metadata = { title: "Yeni destek talebi" };

export default async function NewTicketPage({ searchParams }: PageProps<"/panel/talep/yeni">) {
  // links elsewhere in the panel can pre-select the ticket type with ?tur=
  const { tur } = await searchParams;
  const category = NEW_TICKET_CATEGORIES.find((c) => c === tur);

  return (
    <div style={{ maxWidth: 720 }}>
      <PageHeader back={{ href: "/panel/talep", label: "Destek taleplerine dön" }} title="Size nasıl yardımcı olalım?" description="Ne kadar ayrıntı yazarsanız o kadar hızlı çözeriz." />
      <NewTicketForm defaultCategory={category} />
    </div>
  );
}
