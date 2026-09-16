import Link from "next/link";
import type { ProjectStage } from "@/db/schema";
import { SERVICE_LABELS, STAGE_LABELS } from "@/features/projects/labels";
import type { ProjectDetail, ProjectSummary } from "@/features/projects/queries";
import { daysUntil } from "@/lib/dates";
import { formatDate, formatShortDate, relativeDue } from "@/lib/format";
import { Icon, SERVICE_ICONS } from "./Icon";

export function StagePill({ stage }: { stage: ProjectStage }) {
  return <span className={`stage${stage === "live" ? " is-live" : ""}`}>{STAGE_LABELS[stage]}</span>;
}

export function ProgressBar({ progress, doneCount, total }: { progress: number; doneCount: number; total: number }) {
  return (
    <div>
      <div className="progress-row"><span><b>%{progress}</b> tamamlandı</span><span>{doneCount}/{total} aşama</span></div>
      <div className="progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Proje ilerlemesi">
        <i style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

export function ProjectCard({ project, href, showCompany = false }: { project: ProjectSummary; href: string; showCompany?: boolean }) {
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
      <ProgressBar progress={project.progress} doneCount={project.doneCount} total={project.total} />
      {next ? (
        <div className="next-step">
          <Icon name="calendar" size={16} />
          <span>Sıradaki: {next.title}</span>
          {next.dueOn && <small className={late ? "is-late" : undefined}>{relativeDue(next.dueOn)}</small>}
        </div>
      ) : (
        <div className="next-step"><Icon name="check" size={16} /><span>Tüm aşamalar tamamlandı</span></div>
      )}
    </Link>
  );
}

type ToggleAction = (milestoneId: string) => (() => Promise<void>) | undefined;

/** Project milestones as a timeline; the team gets a button per step to mark it done or undo it. */
export function MilestoneTimeline({ project, toggleAction }: { project: ProjectDetail; toggleAction?: ToggleAction }) {
  const currentId = project.next?.id;
  return (
    <ol className={`tracker${toggleAction ? " has-actions" : ""}`}>
      {project.milestones.map((m) => {
        const state = m.completedAt ? "is-done" : m.id === currentId ? "is-current" : "is-upcoming";
        const action = toggleAction?.(m.id);
        return (
          <li key={m.id} className={state} aria-current={state === "is-current" ? "step" : undefined}>
            <span className="tracker-dot">{m.completedAt && <Icon name="check" size={14} />}</span>
            <div>
              <strong>{m.title}</strong>
              <small>
                {m.completedAt ? `${formatShortDate(m.completedAt)} tarihinde tamamlandı` : m.dueOn ? `Hedef: ${formatDate(m.dueOn)}, ${relativeDue(m.dueOn).toLocaleLowerCase("tr-TR")}` : "Tarih belirlenmedi"}
              </small>
            </div>
            {action && (
              <form action={action}>
                <button className="btn btn-ghost btn-small" type="submit">{m.completedAt ? "Geri al" : "Tamamlandı"}</button>
              </form>
            )}
          </li>
        );
      })}
    </ol>
  );
}
