import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { ProjectMilestones } from "@/components/app/project-milestones";
import { AddMilestoneForm, EditProjectForm, ProjectUpdateComposer } from "@/components/app/project-forms";
import { StageBar } from "@/components/app/projects";
import { ProjectView } from "@/components/app/ProjectView";
import { listProjectUpdateAttachments } from "@/features/attachments/queries";
import { listStaff } from "@/features/customers/queries";
import { listDocuments } from "@/features/documents/queries";
import { updateProject, updateProjectStage } from "@/features/projects/actions";
import { addMilestone, deleteMilestone, moveMilestone, saveMilestone, toggleMilestone } from "@/features/projects/milestone-actions";
import { getProject, listProjectUpdates } from "@/features/projects/queries";
import { addProjectUpdate, deleteProjectUpdate } from "@/features/projects/update-actions";
import { requireStaff } from "@/lib/auth/session";
import { dayKey } from "@/lib/dates";

export const metadata: Metadata = { title: "Proje" };

export default async function TeamProjectPage({ params }: PageProps<"/yonetim/projeler/[id]">) {
  const user = await requireStaff();
  const { id } = await params;
  const project = z.uuid().safeParse(id).success ? await getProject(id) : null;
  if (!project) notFound();

  const [documents, updates, attachments, staff] = await Promise.all([
    listDocuments({ projectId: id }),
    listProjectUpdates(id, { includeInternal: true }),
    listProjectUpdateAttachments(id, { includeInternal: true }),
    listStaff(),
  ]);

  return (
    <ProjectView
      project={project}
      documents={documents}
      updates={updates}
      attachments={attachments}
      backHref="/yonetim/projeler"
      showCompany
      viewerId={user.id}
      stageBar={<StageBar stage={project.stage} action={updateProjectStage.bind(null, id)} />}
      milestones={
        <ProjectMilestones
          project={project}
          saveAction={(milestoneId) => saveMilestone.bind(null, id, milestoneId)}
          toggleAction={(milestoneId) => toggleMilestone.bind(null, id, milestoneId)}
          moveAction={(milestoneId, direction) => moveMilestone.bind(null, id, milestoneId, direction)}
          deleteAction={(milestoneId) => deleteMilestone.bind(null, id, milestoneId)}
        />
      }
      addMilestone={<AddMilestoneForm action={addMilestone.bind(null, id)} />}
      composer={<ProjectUpdateComposer action={addProjectUpdate.bind(null, id)} companyId={project.companyId} />}
      deleteUpdateAction={(updateId) => deleteProjectUpdate.bind(null, id, updateId)}
      editForm={
        <EditProjectForm
          action={updateProject.bind(null, id)}
          staff={staff}
          values={{
            name: project.name,
            service: project.service,
            summary: project.summary,
            assigneeId: project.assigneeId ?? "",
            startsOn: dayKey(project.startsOn),
            dueOn: project.dueOn ? dayKey(project.dueOn) : "",
          }}
        />
      }
    />
  );
}
