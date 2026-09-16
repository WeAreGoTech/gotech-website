import type { Metadata } from "next";
import { EmptyState, PageHeader } from "@/components/app/AppShell";
import { ProjectCard } from "@/components/app/projects";
import { listProjects } from "@/features/projects/queries";
import { requireCustomer } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Projeler" };

export default async function CustomerProjectsPage() {
  const user = await requireCustomer();
  const projects = await listProjects(user.companyId);

  return (
    <>
      <PageHeader title="Projeler" description="Sizin için yürüttüğümüz işler, hangi aşamada oldukları ve sıradaki adım." />
      {projects.length === 0 ? (
        <EmptyState title="Henüz proje yok" text="Birlikte bir işe başladığımızda ilerlemesini buradan takip edeceksiniz." />
      ) : (
        <div className="projects">
          {projects.map((p) => <ProjectCard key={p.id} project={p} href={`/panel/projeler/${p.id}`} />)}
        </div>
      )}
    </>
  );
}
