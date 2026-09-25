import type { Metadata } from "next";
import { PageHeader } from "@/components/app/AppShell";
import { Section } from "@/components/app/dashboard";
import { ProjectCard } from "@/components/app/projects";
import { CreateProjectForm } from "@/components/app/staff-forms";
import { listCompaniesWithCustomers, listStaff } from "@/features/customers/queries";
import { listProjects } from "@/features/projects/queries";
import { requireStaff } from "@/lib/auth/session";
import { dayKey } from "@/lib/dates";

export const metadata: Metadata = { title: "Projeler" };

export default async function TeamProjectsPage() {
  await requireStaff();
  const [projects, companies, staff] = await Promise.all([listProjects(), listCompaniesWithCustomers(), listStaff()]);
  const ongoing = projects.filter((p) => p.stage !== "live");
  const live = projects.filter((p) => p.stage === "live");

  return (
    <>
      <PageHeader title="Projeler" description="Tüm müşterilerin projeleri. Adımları işaretledikçe müşteri panelinde ilerleme güncellenir." />
      <div className="t-layout">
        <div>
          <Section title={`Süren projeler (${ongoing.length})`}>
            <div className="projects">{ongoing.map((p) => <ProjectCard key={p.id} project={p} href={`/yonetim/projeler/${p.id}`} showCompany showAssignee />)}</div>
          </Section>
          <Section title={`Canlıdakiler (${live.length})`}>
            <div className="projects">{live.map((p) => <ProjectCard key={p.id} project={p} href={`/yonetim/projeler/${p.id}`} showCompany showAssignee />)}</div>
          </Section>
        </div>
        <CreateProjectForm companies={companies.filter((c) => !c.closedAt).map((c) => ({ id: c.id, name: c.name }))} staff={staff.map((s) => ({ id: s.id, name: s.name }))} today={dayKey(new Date())} />
      </div>
    </>
  );
}
