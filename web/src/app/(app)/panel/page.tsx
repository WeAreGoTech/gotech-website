import type { Metadata } from "next";
import Link from "next/link";
import { ActivityFeed, Section, Stat } from "@/components/app/dashboard";
import { Icon } from "@/components/app/Icon";
import { ProjectCard } from "@/components/app/projects";
import { getCompanyName } from "@/features/customers/queries";
import { customerOverview } from "@/features/dashboard/queries";
import { requireCustomer } from "@/lib/auth/session";
import { formatDate, formatMoney } from "@/lib/format";

export const metadata: Metadata = { title: "Genel bakış" };

export default async function CustomerHomePage() {
  const user = await requireCustomer();
  const [companyName, overview] = await Promise.all([getCompanyName(user.companyId), customerOverview(user.companyId)]);
  const { nextInvoice, overdueCount } = overview;

  const paymentNote = overdueCount
    ? `${overdueCount} faturanın vadesi geçti`
    : nextInvoice
      ? `Sıradaki ödeme ${formatDate(nextInvoice.dueOn)}`
      : "Bekleyen faturanız yok";

  return (
    <>
      <h1 className="greeting">Merhaba {user.name.split(" ")[0]}</h1>
      <p>{companyName} için talepler, projeler ve faturalar tek yerde.</p>

      <div className="quick">
        <Link className="btn" href="/panel/talep/yeni"><Icon name="plus" size={18} />Destek talebi aç</Link>
        <Link className="btn btn-ghost" href="/panel/faturalar"><Icon name="receipt" size={18} />Faturalar</Link>
        <Link className="btn btn-ghost" href="/panel/dokumanlar"><Icon name="file" size={18} />Dokümanlar</Link>
      </div>

      <div className="stats">
        <Stat hero label="Ödenecek tutar" icon="wallet" value={formatMoney(overview.unpaidTotal)} note={paymentNote} alert={overdueCount > 0} href="/panel/faturalar" />
        <Stat label="Açık talepler" icon="inbox" value={overview.openTickets} note={overview.openTickets ? "Ekibimiz ilgileniyor" : "Her şey yolunda"} href="/panel/talep" />
        <Stat label="Süren projeler" icon="folder" value={overview.activeProjects.length} note={`${overview.liveProjects} proje canlıda`} href="/panel/projeler" />
      </div>

      <div className="two-col">
        <Section title="Süren projeler" href="/panel/projeler">
          {overview.activeProjects.length ? (
            <div className="projects">
              {overview.activeProjects.map((p) => <ProjectCard key={p.id} project={p} href={`/panel/projeler/${p.id}`} />)}
            </div>
          ) : (
            <ul className="w-list"><li className="empty-row">Şu an süren bir proje yok.</li></ul>
          )}
        </Section>
        <Section title="Son hareketler">
          <ActivityFeed items={overview.feed} />
        </Section>
      </div>
    </>
  );
}
