import { z } from "zod";
import { TICKET_PRIORITIES, TICKET_STATUSES } from "@/db/schema";
import { NEW_TICKET_CATEGORIES } from "./labels";

const MESSAGE_MAX = 5000;
export const SUBJECT_MAX = 140;

const messageBody = z
  .string()
  .trim()
  .min(1, { error: "Mesajı yazın." })
  .max(MESSAGE_MAX, { error: `Mesaj en fazla ${MESSAGE_MAX} karakter olabilir.` });

export const newTicketSchema = z.object({
  subject: z.string().trim().min(5, { error: "Konuyu en az 5 karakterle yazın." }).max(SUBJECT_MAX, { error: `Konu en fazla ${SUBJECT_MAX} karakter olabilir.` }),
  category: z.enum(NEW_TICKET_CATEGORIES, { error: "Talep türünü seçin." }),
  priority: z.enum(TICKET_PRIORITIES, { error: "Önceliği seçin." }),
  body: messageBody.min(10, { error: "Sorunu birkaç cümleyle anlatın (en az 10 karakter)." }),
});

export const replySchema = z.object({
  body: messageBody,
  internal: z.boolean(),
});

export const staffUpdateSchema = z.object({
  status: z.enum(TICKET_STATUSES, { error: "Durumu seçin." }),
  priority: z.enum(TICKET_PRIORITIES, { error: "Önceliği seçin." }),
  assigneeId: z.union([z.uuid(), z.literal("")]),
});

export const ratingSchema = z.object({
  rating: z.coerce.number({ error: "Bir puan seçin." }).int().min(1, { error: "Bir puan seçin." }).max(5),
  comment: z.string().trim().max(500),
});
