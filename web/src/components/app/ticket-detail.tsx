import type { ReactNode } from "react";
import type { TicketCategory, TicketPriority, TicketStatus } from "@/db/schema";
import { CATEGORY_LABELS } from "@/features/tickets/labels";
import { BackButton } from "./AppShell";
import { formatDateTime } from "./format";
import { CATEGORY_ICONS, Icon } from "./Icon";
import { PriorityText, StatusPill, type Audience } from "./TicketList";

type HeaderTicket = { number: number; subject: string; status: TicketStatus; priority: TicketPriority; category: TicketCategory };

export function TicketHeader({ ticket, audience, backHref, extra }: { ticket: HeaderTicket; audience: Audience; backHref: string; extra?: string }) {
  return (
    <>
      <BackButton href={backHref} label="Destek taleplerine dön" />
      <header className="t-head">
        <span className="w-icon is-large"><Icon name={CATEGORY_ICONS[ticket.category]} size={24} /></span>
        <div className="t-head-text">
          <h1>{ticket.subject}</h1>
          <div className="t-meta">
            <StatusPill status={ticket.status} audience={audience} />
            <span>#{ticket.number}</span>
            <span>{CATEGORY_LABELS[ticket.category]}</span>
            {extra && <span>{extra}</span>}
            <PriorityText priority={ticket.priority} />
          </div>
        </div>
      </header>
    </>
  );
}

type Step = { title: string; note?: string };

// open and in_progress sit on "İnceleniyor", waiting_customer on "Yanıtlandı", closed completes every step
const CURRENT_STEP: Record<TicketStatus, number> = { open: 1, in_progress: 1, waiting_customer: 2, closed: 4 };

function trackerSteps(status: TicketStatus, audience: Audience, createdAt: Date, updatedAt: Date): Step[] {
  const reviewNote: Partial<Record<TicketStatus, string>> =
    audience === "customer"
      ? { open: "Talebiniz ekibimizin sırasında", in_progress: "Ekibimiz üzerinde çalışıyor" }
      : { open: "Henüz yanıtlanmadı", in_progress: "Üzerinde çalışılıyor" };
  return [
    { title: "Talep alındı", note: formatDateTime(createdAt) },
    { title: "İnceleniyor", note: reviewNote[status] },
    { title: "Yanıtlandı", note: status === "waiting_customer" ? (audience === "customer" ? "Sizden yanıt bekleniyor" : "Müşteriden yanıt bekleniyor") : undefined },
    { title: "Çözüldü", note: status === "closed" ? formatDateTime(updatedAt) : undefined },
  ];
}

/** Ticket progress as one horizontal row under the title, so the side column stays short. */
export function StatusStepper({ status, audience, createdAt, updatedAt }: { status: TicketStatus; audience: Audience; createdAt: Date; updatedAt: Date }) {
  const current = CURRENT_STEP[status];
  return (
    <ol className="hstepper" aria-label="Talep durumu">
      {trackerSteps(status, audience, createdAt, updatedAt).map((step, i) => {
        const state = i < current ? "is-done" : i === current ? "is-current" : "is-upcoming";
        return (
          <li key={step.title} className={state} aria-current={state === "is-current" ? "step" : undefined}>
            <span className="tracker-dot">{state === "is-done" && <Icon name="check" size={12} />}</span>
            <span className="hstepper-text">
              <strong>{step.title}</strong>
              {step.note && <small>{step.note}</small>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function DetailRows({ title, rows, compact = false, children }: { title?: string; rows: [string, ReactNode][]; compact?: boolean; children?: ReactNode }) {
  return (
    <div className={`card${compact ? " compact" : ""}`}>
      {title && <h2>{title}</h2>}
      <dl className="drows">
        {rows.map(([label, value]) => (
          <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
        ))}
      </dl>
      {children}
    </div>
  );
}
