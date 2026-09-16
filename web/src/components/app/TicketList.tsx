import Link from "next/link";
import type { TicketPriority, TicketStatus } from "@/db/schema";
import { CATEGORY_LABELS, PRIORITY_LABELS, STATUS_LABELS } from "@/features/tickets/labels";
import type { CompanyTicketRow } from "@/features/tickets/queries";
import { formatShortDate } from "./format";
import { CATEGORY_ICONS, Icon } from "./Icon";

export type Audience = "staff" | "customer";
type Row = Omit<CompanyTicketRow, "deviceId"> & { deviceId?: string | null; companyName?: string; assigneeName?: string | null };

export function StatusPill({ status, audience }: { status: TicketStatus; audience: Audience }) {
  return <span className={`status is-${status}`}>{STATUS_LABELS[audience][status]}</span>;
}

export function PriorityText({ priority }: { priority: TicketPriority }) {
  if (priority === "normal") return null;
  return <em className={`prio is-${priority}`}>{PRIORITY_LABELS[priority]}</em>;
}

export function TicketList({ rows, audience }: { rows: Row[]; audience: Audience }) {
  const base = audience === "staff" ? "/yonetim/talep" : "/panel/talep";
  return (
    <ul className="w-list">
      {rows.map((row) => (
        <li key={row.id}>
          <Link className="w-row" href={`${base}/${row.number}`}>
            <span className="w-icon"><Icon name={CATEGORY_ICONS[row.category]} /></span>
            <span className="w-row-main">
              <strong>{row.subject}</strong>
              <small>
                {row.companyName ? `${row.companyName}, ` : ""}#{row.number}, {CATEGORY_LABELS[row.category]}
                {row.priority !== "normal" && <>, <PriorityText priority={row.priority} /></>}
                {audience === "staff" && row.deviceId && (
                  <span className="t-device" title="GoTech Desk üzerinden açıldı"><Icon name="monitor" size={14} /> Uzak destek</span>
                )}
              </small>
            </span>
            <span className="w-row-side">
              <StatusPill status={row.status} audience={audience} />
              <small>{audience === "staff" && row.assigneeName ? `${row.assigneeName}, ` : ""}{formatShortDate(row.updatedAt)}</small>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
