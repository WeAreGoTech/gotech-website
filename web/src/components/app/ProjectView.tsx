import type { ReactNode } from "react";
import type { AttachmentView } from "@/features/attachments/queries";
import type { DocumentRow } from "@/features/documents/queries";
import { SERVICE_LABELS } from "@/features/projects/labels";
import type { ProjectDetail, ProjectUpdate } from "@/features/projects/queries";
import { formatDate } from "@/lib/format";
import { BackButton } from "./AppShell";
import { Section } from "./dashboard";
import { DocumentList } from "./documents";
import { Icon, SERVICE_ICONS } from "./Icon";
import { ProjectUpdates } from "./project-updates";
import { ProgressBar } from "./projects";
import { DetailRows } from "./ticket-detail";

type ProjectViewProps = {
  project: ProjectDetail;
  documents: DocumentRow[];
  updates: ProjectUpdate[];
  attachments: Record<string, AttachmentView[]>;
  backHref: string;
  showCompany?: boolean;
  /** the stage bar under the title, clickable for the team and read-only for the customer */
  stageBar: ReactNode;
  /** the step list: the team's editable one or the customer's timeline */
  milestones: ReactNode;
  /** the team's extras: a form to add a step, one to write a note, and the project's own edit card */
  addMilestone?: ReactNode;
  composer?: ReactNode;
  editForm?: ReactNode;
  viewerId?: string;
  deleteUpdateAction?: (updateId: string) => (formData: FormData) => Promise<void>;
};

/** Project page shared by both panels; the team version adds the stage, step, note and edit controls. */
export function ProjectView(props: ProjectViewProps) {
  const { project, documents, updates, attachments, backHref, showCompany, stageBar, milestones } = props;
  return (
    <>
      <BackButton href={backHref} label="Projelere dön" />
      <header className="t-head">
        <span className="w-icon is-large"><Icon name={SERVICE_ICONS[project.service]} size={24} /></span>
        <div className="t-head-text">
          <h1>{project.name}</h1>
          <div className="t-meta">
            <span>{SERVICE_LABELS[project.service]}</span>
            {showCompany && <span>{project.companyName}</span>}
            <span>{project.assigneeName ? `Sorumlu: ${project.assigneeName}` : "Atanmadı"}</span>
          </div>
        </div>
      </header>
      {stageBar}

      <div className="t-layout">
        <div className="stack">
          <div className="card">
            <h2>Adımlar</h2>
            {milestones}
            {props.addMilestone}
          </div>
          <div className="card">
            <h2>İlerleme notları</h2>
            {props.composer}
            <ProjectUpdates updates={updates} attachments={attachments} viewerId={props.viewerId} deleteAction={props.deleteUpdateAction} />
          </div>
          <Section title="Dokümanlar"><DocumentList documents={documents} /></Section>
        </div>
        <aside className="t-side">
          {props.editForm}
          <DetailRows
            title="Proje özeti"
            rows={[
              ["Başlangıç", formatDate(project.startsOn)],
              ["Hedef teslim", project.dueOn ? formatDate(project.dueOn) : "Belirlenmedi"],
              ["Hizmet", SERVICE_LABELS[project.service]],
              ["Sorumlu", project.assigneeName ?? "Atanmadı"],
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
