import type { Metadata } from "next";
import { EmptyState, PageHeader } from "@/components/app/AppShell";
import { formatDateTime } from "@/components/app/format";
import { LeadStatusForm } from "@/components/app/team-forms";
import type { LeadTopic } from "@/db/schema";
import { updateLeadStatus } from "@/features/leads/actions";
import { convertLeadToCustomer } from "@/features/team/actions";
import { TOPIC_LABELS } from "@/features/leads/labels";
import { listLeads } from "@/features/leads/queries";
import { requireStaff } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Başvurular" };

export default async function LeadsPage() {
  await requireStaff();
  const leads = await listLeads();

  return (
    <>
      <PageHeader title="Başvurular" description="Web sitesindeki iletişim formundan gelenler. Her yeni başvuru e-posta ile de bildirilir." />
      {leads.length === 0 ? (
        <EmptyState title="Henüz başvuru yok" text="Sitedeki iletişim formu doldurulduğunda burada görünür." />
      ) : (
        <div className="list">
          {leads.map((lead) => (
            <article key={lead.id} className="list-item">
              <div className="list-item-head">
                <h3>{lead.name}{lead.company && <span className="muted">, {lead.company}</span>}</h3>
                <LeadStatusForm action={updateLeadStatus.bind(null, lead.id)} status={lead.status} />
              </div>
              <div className="muted">
                <a href={`mailto:${lead.email}`}>{lead.email}</a>
                {lead.phone && <> ya da <a href={`tel:${lead.phone.replace(/\s/g, "")}`}>{lead.phone}</a></>}
                <span>, {formatDateTime(lead.createdAt)}</span>
              </div>
              {lead.topics.length > 0 && (
                <ul className="chips">{lead.topics.map((t) => <li key={t}>{TOPIC_LABELS[t as LeadTopic] ?? t}</li>)}</ul>
              )}
              {lead.message && <p className="msg-body">{lead.message}</p>}
              {lead.status !== "won" && lead.status !== "lost" && (
                <form action={convertLeadToCustomer.bind(null, lead.id)}>
                  <button className="btn btn-small" type="submit">Müşteriye dönüştür ve davet et</button>
                </form>
              )}
            </article>
          ))}
        </div>
      )}
    </>
  );
}
