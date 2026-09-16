import Link from "next/link";
import type { ReactNode } from "react";
import type { ActivityItem } from "@/features/dashboard/queries";
import { formatShortDate } from "@/lib/format";
import { Icon, type IconName } from "./Icon";

type StatProps = { label: string; icon: IconName; value: ReactNode; note?: ReactNode; alert?: boolean; hero?: boolean; href?: string };

export function Stat({ label, icon, value, note, alert, hero, href }: StatProps) {
  const body = (
    <>
      <span className="stat-label"><span className="w-icon"><Icon name={icon} size={18} /></span>{label}</span>
      <span className="stat-value">{value}</span>
      {note && <span className={`stat-note${alert ? " is-alert" : ""}`}>{note}</span>}
    </>
  );
  const className = `stat${hero ? " is-hero" : ""}`;
  return href ? <Link className={className} href={href}>{body}</Link> : <div className={className}>{body}</div>;
}

export function Section({ title, href, linkLabel = "Tümünü gör", children }: { title: string; href?: string; linkLabel?: string; children: ReactNode }) {
  return (
    <section className="sec">
      <div className="sec-head">
        <h2>{title}</h2>
        {href && <Link href={href}>{linkLabel}</Link>}
      </div>
      {children}
    </section>
  );
}

const FEED_ICONS: Record<ActivityItem["kind"], IconName> = { message: "chat", document: "file", milestone: "check", invoice: "receipt" };

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <ul className="w-list">
      {items.length === 0 && <li className="empty-row">Henüz bir hareket yok.</li>}
      {items.map((item) => (
        <li key={`${item.kind}-${item.id}`}>
          <Link className="w-row" href={item.href}>
            <span className="w-icon"><Icon name={FEED_ICONS[item.kind]} size={18} /></span>
            <span className="w-row-main"><strong>{item.title}</strong><small>{item.detail}</small></span>
            <span className="w-row-side"><small>{formatShortDate(item.at)}</small></span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
