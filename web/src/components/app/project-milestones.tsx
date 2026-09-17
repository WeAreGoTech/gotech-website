import { DatePicker } from "@/components/forms/DatePicker";
import type { ProjectDetail } from "@/features/projects/queries";
import { dayKey } from "@/lib/dates";
import { Icon } from "./Icon";
import { MilestoneNote } from "./projects";

const TITLE_MAX = 120;
const UP = -1;
const DOWN = 1;

type RowAction = (milestoneId: string) => (formData: FormData) => Promise<void>;
type MoveAction = (milestoneId: string, direction: number) => (formData: FormData) => Promise<void>;

type ProjectMilestonesProps = {
  project: ProjectDetail;
  saveAction: RowAction;
  toggleAction: RowAction;
  moveAction: MoveAction;
  deleteAction: RowAction;
};

/**
 * The team's step list: every row is one form whose buttons post to a different action,
 * so renaming, dating, completing, reordering and deleting need no client-side state.
 */
export function ProjectMilestones({ project, saveAction, toggleAction, moveAction, deleteAction }: ProjectMilestonesProps) {
  const currentId = project.next?.id;
  const last = project.milestones.length - 1;
  return (
    <ol className="tracker has-actions">
      {project.milestones.map((m, index) => {
        const state = m.completedAt ? "is-done" : m.id === currentId ? "is-current" : "is-upcoming";
        const dateId = `ms-due-${m.id}`;
        return (
          <li key={m.id} className={state} aria-current={state === "is-current" ? "step" : undefined}>
            <span className="tracker-dot">{m.completedAt && <Icon name="check" size={14} />}</span>
            <div className="ms-body">
              <form className="ms-form" action={saveAction(m.id)}>
                <input className="input ms-title" name="title" defaultValue={m.title} aria-label="Adımın adı" required maxLength={TITLE_MAX} />
                <label className="sr-only" htmlFor={dateId}>Hedef tarih</label>
                <DatePicker id={dateId} name="dueOn" defaultValue={m.dueOn ? dayKey(m.dueOn) : undefined} placeholder="Tarih yok" />
                <div className="ms-actions">
                  <button className="btn btn-ghost btn-small" type="submit">Kaydet</button>
                  <button className="btn btn-ghost btn-small" type="submit" formNoValidate formAction={toggleAction(m.id)}>
                    {m.completedAt ? "Geri al" : "Tamamlandı"}
                  </button>
                  <button className="icon-btn ms-up" type="submit" formNoValidate formAction={moveAction(m.id, UP)} disabled={index === 0} aria-label="Yukarı taşı" title="Yukarı taşı">
                    <Icon name="chevronRight" size={16} />
                  </button>
                  <button className="icon-btn ms-down" type="submit" formNoValidate formAction={moveAction(m.id, DOWN)} disabled={index === last} aria-label="Aşağı taşı" title="Aşağı taşı">
                    <Icon name="chevronRight" size={16} />
                  </button>
                  <button className="icon-btn ms-remove" type="submit" formNoValidate formAction={deleteAction(m.id)} aria-label="Adımı sil" title="Adımı sil">
                    <Icon name="close" size={16} />
                  </button>
                </div>
              </form>
              <MilestoneNote milestone={m} />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
