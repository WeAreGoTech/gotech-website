import Link from "next/link";
import { PROJECT_STAGES, type ProjectStage } from "@/db/schema";
import { SERVICE_LABELS, STAGE_LABELS } from "@/features/projects/labels";
import type { ProjectDetail, ProjectSummary } from "@/features/projects/queries";
import { daysUntil } from "@/lib/dates";
import { formatDate, formatShortDate, relativeDue } from "@/lib/format";
import { Icon, SERVICE_ICONS } from "./Icon";

type Milestone = ProjectDetail["milestones"][number];

export function StagePill({ stage }: { stage: ProjectStage }) {
  return <span className={`stage${stage === "live" ? " is-live" : ""}`}>{STAGE_LABELS[stage]}</span>;
}

export const isOverdue = (milestone: Milestone) => !milestone.completedAt && milestone.dueOn !== null && daysUntil(milestone.dueOn) < 0;

/** When a step was finished, or when it is due; late steps say so. */
export function MilestoneNote({ milestone }: { milestone: Milestone }) {
  if (milestone.completedAt) return <small>{formatShortDate(milestone.completedAt)} tarihinde tamamlandı</small>;
  if (!milestone.dueOn) return <small>Tarih belirlenmedi</small>;
  return (
    <small className={isOverdue(milestone) ? "is-late" : undefined}>
      Hedef: {formatDate(milestone.dueOn)}, {isOverdue(milestone) ? "gecikti, " : ""}
      {relativeDue(milestone.dueOn).toLocaleLowerCase("tr-TR")}
    </small>
  );
}

export function ProgressBar({ progress, doneCount, total }: { progress: number; doneCount: number; total: number }) {
  return (
    <div>
      <div className="progress-row"><span><b>%{progress}</b> tamamlandı</span><span>{doneCount}/{total} adım</span></div>
      <div className="progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Proje ilerlemesi">
        <i style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

type StageAction = (formData: FormData) => Promise<void>;

/** The five stages as one bar under the title. With an action every stage is a button that moves the project there. */
export function StageBar({ stage, action }: { stage: ProjectStage; action?: StageAction }) {
  const current = PROJECT_STAGES.indexOf(stage);
  const steps = PROJECT_STAGES.map((value, index) => ({
    value,
    className: `stagebar-step${index < current ? " is-done" : index === current ? " is-current" : " is-upcoming"}`,
    current: value === stage ? ("step" as const) : undefined,
  }));

  if (!action) {
    return (
      <ol className="stagebar" aria-label="Proje aşaması">
        {steps.map((step) => <li key={step.value} className={step.className} aria-current={step.current}>{STAGE_LABELS[step.value]}</li>)}
      </ol>
    );
  }
  return (
    <form className="stagebar" action={action} aria-label="Proje aşaması">
      {steps.map((step) => (
        <button key={step.value} className={step.className} type="submit" name="stage" value={step.value} aria-current={step.current}>
          {STAGE_LABELS[step.value]}
        </button>
      ))}
    </form>
  );
}

export function ProjectCard({ project, href, showCompany = false, showAssignee = false }: { project: ProjectSummary; href: string; showCompany?: boolean; showAssignee?: boolean }) {
  const next = project.next;
  const late = next?.dueOn ? daysUntil(next.dueOn) < 0 : false;
  return (
    <Link className="project-card" href={href}>
      <div className="project-card-head">
        <span className="w-icon"><Icon name={SERVICE_ICONS[project.service]} /></span>
        <div>
          <strong>{project.name}</strong>
          <small>{showCompany ? `${project.companyName}, ` : ""}{SERVICE_LABELS[project.service]}</small>
        </div>
      </div>
      <div><StagePill stage={project.stage} /></div>
      {showAssignee && (
        <div className="project-owner">
          <Icon name="user" size={16} />
          <span>{project.assigneeName ? `Sorumlu: ${project.assigneeName}` : "Atanmadı"}</span>
        </div>
      )}
      <ProgressBar progress={project.progress} doneCount={project.doneCount} total={project.total} />
      {next ? (
        <div className="next-step">
          <Icon name="calendar" size={16} />
          <span>Sıradaki: {next.title}</span>
          {next.dueOn && <small className={late ? "is-late" : undefined}>{relativeDue(next.dueOn)}</small>}
        </div>
      ) : (
        <div className="next-step"><Icon name="check" size={16} /><span>Tüm adımlar tamamlandı</span></div>
      )}
      {project.lastUpdateAt && <small className="project-note">Son not: {formatShortDate(project.lastUpdateAt)}</small>}
    </Link>
  );
}

/** Read-only milestone timeline, shown to the customer; the team gets ProjectMilestones instead. */
export function MilestoneTimeline({ project }: { project: ProjectDetail }) {
  const currentId = project.next?.id;
  return (
    <ol className="tracker">
      {project.milestones.map((m) => {
        const state = m.completedAt ? "is-done" : m.id === currentId ? "is-current" : "is-upcoming";
        return (
          <li key={m.id} className={state} aria-current={state === "is-current" ? "step" : undefined}>
            <span className="tracker-dot">{m.completedAt && <Icon name="check" size={14} />}</span>
            <div>
              <strong>{m.title}</strong>
              <MilestoneNote milestone={m} />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
