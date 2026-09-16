import type { ReactNode } from "react";
import type { DocumentRow } from "@/features/documents/queries";
import type { InvoiceSummary } from "@/features/invoices/queries";
import { SERVICE_LABELS } from "@/features/projects/labels";
import type { ProjectDetail } from "@/features/projects/queries";
import { formatDate } from "@/lib/format";
import { BackButton } from "./AppShell";
import { Section } from "./dashboard";
import { DocumentList } from "./documents";
import { Icon, SERVICE_ICONS } from "./Icon";
import { InvoiceList } from "./invoices";
import { MilestoneTimeline, ProgressBar, StagePill } from "./projects";
import { DetailRows } from "./ticket-detail";

type ProjectViewProps = {
  project: ProjectDetail;
  documents: DocumentRow[];
  invoices: InvoiceSummary[];
  backHref: string;
  invoiceBase: string;
  showCompany?: boolean;
  stageControl?: ReactNode;
  toggleAction?: (milestoneId: string) => () => Promise<void>;
};

/** Project page shared by both panels; the team version adds stage and milestone controls. */
export function ProjectView({ project, documents, invoices, backHref, invoiceBase, showCompany, stageControl, toggleAction }: ProjectViewProps) {
  return (
    <>
      <BackButton href={backHref} label="Projelere dön" />
      <header className="t-head">
        <span className="w-icon is-large"><Icon name={SERVICE_ICONS[project.service]} size={24} /></span>
        <div className="t-head-text">
          <h1>{project.name}</h1>
          <div className="t-meta">
            {stageControl ?? <StagePill stage={project.stage} />}
            <span>{SERVICE_LABELS[project.service]}</span>
            {showCompany && <span>{project.companyName}</span>}
          </div>
        </div>
      </header>

      <div className="t-layout">
        <div className="stack">
          <div className="card">
            <h2>Aşamalar</h2>
            <MilestoneTimeline project={project} toggleAction={toggleAction} />
          </div>
          <Section title="Dokümanlar"><DocumentList documents={documents} /></Section>
          <Section title="Faturalar"><InvoiceList invoices={invoices} basePath={invoiceBase} /></Section>
        </div>
        <aside className="t-side">
          <DetailRows
            title="Proje özeti"
            rows={[
              ["Başlangıç", formatDate(project.startsOn)],
              ["Hedef teslim", project.dueOn ? formatDate(project.dueOn) : "Belirlenmedi"],
              ["Hizmet", SERVICE_LABELS[project.service]],
            ]}
          >
            <div style={{ marginTop: 18 }}><ProgressBar progress={project.progress} doneCount={project.doneCount} total={project.total} /></div>
            {project.summary && <p className="muted" style={{ margin: "16px 0 0" }}>{project.summary}</p>}
          </DetailRows>
        </aside>
      </div>
    </>
  );
}
