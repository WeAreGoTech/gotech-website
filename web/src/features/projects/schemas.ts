import { z } from "zod";
import { PROJECT_STAGES, SERVICE_KINDS } from "@/db/schema";

const NAME_MAX = 120;
const SUMMARY_MAX = 500;
const UPDATE_BODY_MAX = 4000;

const DATE_ERROR = "Geçerli bir tarih seçin.";
/** A DateField that was left empty submits "". */
const optionalDate = z.union([z.iso.date({ error: DATE_ERROR }), z.literal("")]);
/** A SelectField with an "Atanmadı" option submits "". */
const optionalStaffId = z.union([z.uuid({ error: "Ekip üyesini seçin." }), z.literal("")]);

/** The fields the edit form writes; the stage has its own bar and is not part of it. */
export const projectFieldsSchema = z.object({
  name: z.string().trim().min(3, { error: "Proje adını yazın." }).max(NAME_MAX),
  service: z.enum(SERVICE_KINDS, { error: "Hizmet türünü seçin." }),
  summary: z.string().trim().max(SUMMARY_MAX),
  assigneeId: optionalStaffId,
  startsOn: z.iso.date({ error: DATE_ERROR }),
  dueOn: optionalDate,
});

export const createProjectSchema = projectFieldsSchema.extend({
  companyId: z.uuid({ error: "Firmayı seçin." }),
  stage: z.enum(PROJECT_STAGES, { error: "Aşama seçin." }),
});

export const stageSchema = z.enum(PROJECT_STAGES);

export const milestoneSchema = z.object({
  title: z.string().trim().min(2, { error: "Adımın adını yazın." }).max(NAME_MAX),
  dueOn: optionalDate,
});

export const projectUpdateSchema = z.object({
  body: z.string().trim().min(2, { error: "Not boş olamaz." }).max(UPDATE_BODY_MAX),
  isInternal: z.boolean(),
});
