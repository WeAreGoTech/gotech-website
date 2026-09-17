import type { Metadata } from "next";
import Link from "next/link";
import { Section, Stat } from "@/components/app/dashboard";
import { Icon } from "@/components/app/Icon";
import { TicketList } from "@/components/app/TicketList";
import { staffOverview } from "@/features/dashboard/queries";
import { requireStaff } from "@/lib/auth/session";
import { daysUntil } from "@/lib/dates";
import { greeting, relativeDue } from "@/lib/format";

export const metadata: Metadata = { title: "Genel bakış" };

export default async function TeamHomePage() {
  const user = await requireStaff();
  const o = await staffOverview(user.id);

  return (
    <>
      <h1 className="greeting">{greeting()} {user.name.split(" ")[0]}</h1>
      <p>{o.customerCount} müşteri, {o.active} açık talep, {o.upcoming.length} yaklaşan teslim.</p>

      <div className="quick">
        <Link className="btn" href="/yonetim/talep?durum=acik"><Icon name="inbox" size={18} />Yanıt bekleyen talepler</Link>
        <Link className="btn btn-ghost" href="/yonetim/projeler"><Icon name="plus" size={18} />Yeni proje</Link>
        <Link className="btn btn-ghost" href="/yonetim/cihazlar"><Icon name="monitor" size={18} />Cihazlar</Link>
      </div>

      <div className="stats">
        <Stat hero label="Yanıt bekleyen" icon="inbox" value={o.open} note={o.urgentOpen ? `${o.urgentOpen} acil talep var` : "Acil talep yok"} alert={o.urgentOpen > 0} href="/yonetim/talep?durum=acik" />
        <Stat label="Cihazlar" icon="monitor" value={o.devices.total} note={o.devices.online === null ? "Çevrimiçi durumu alınamadı" : `${o.devices.online} tanesi çevrimiçi`} href="/yonetim/cihazlar" />
        <Stat label="Müşteri memnuniyeti" icon="star" value={o.rating ? `${o.rating.toLocaleString("tr-TR", { maximumFractionDigits: 1 })}/5` : "Henüz yok"} note={`${o.ratedCount} değerlendirme`} />
        <Stat label="Yeni başvurular" icon="form" value={o.newLeads} note="Web sitesindeki formdan" href="/yonetim/basvurular" />
      </div>

      <div className="two-col">
        <Section title="Sana atanan talepler" href="/yonetim/talep">
          {o.mine.length ? <TicketList rows={o.mine} audience="staff" /> : <ul className="w-list"><li className="empty-row">Üzerinde açık talep yok.</li></ul>}
        </Section>
        <Section title="Yaklaşan teslimler" href="/yonetim/projeler">
          <ul className="w-list">
            {o.upcoming.length === 0 && <li className="empty-row">Önümüzdeki iki haftada teslim yok.</li>}
            {o.upcoming.map((m) => (
              <li key={m.id}>
                <Link className="w-row" href={`/yonetim/projeler/${m.projectId}`}>
                  <span className="w-icon"><Icon name="calendar" size={18} /></span>
                  <span className="w-row-main"><strong>{m.title}</strong><small>{m.companyName}, {m.projectName}</small></span>
                  <span className="w-row-side">
                    <small style={m.dueOn && daysUntil(m.dueOn) < 0 ? { color: "var(--w-negative)", fontWeight: 600 } : undefined}>{m.dueOn ? relativeDue(m.dueOn) : ""}</small>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </>
  );
}
