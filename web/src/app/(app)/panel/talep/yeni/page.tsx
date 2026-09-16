import type { Metadata } from "next";
import { PageHeader } from "@/components/app/AppShell";
import { NewTicketForm } from "@/components/app/ticket-forms";
import { TICKET_CATEGORIES, type TicketCategory } from "@/db/schema";

export const metadata: Metadata = { title: "Yeni destek talebi" };

const INVOICE_NUMBER = /^GT-\d{4}-\d{4}$/;

export default async function NewTicketPage({ searchParams }: PageProps<"/panel/talep/yeni">) {
  // links elsewhere in the panel can pre-fill the form, e.g. "ask about this invoice"
  const { tur, fatura } = await searchParams;
  const category = TICKET_CATEGORIES.find((c) => c === tur) as TicketCategory | undefined;
  const subject = typeof fatura === "string" && INVOICE_NUMBER.test(fatura) ? `${fatura} numaralı fatura hakkında` : "";

  return (
    <div style={{ maxWidth: 720 }}>
      <PageHeader back={{ href: "/panel/talep", label: "Destek taleplerine dön" }} title="Size nasıl yardımcı olalım?" description="Ne kadar ayrıntı yazarsanız o kadar hızlı çözeriz." />
      <NewTicketForm defaultCategory={category} defaultSubject={subject} />
    </div>
  );
}
