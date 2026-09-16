import { sql } from "drizzle-orm";
import { boolean, date, index, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const USER_ROLES = ["staff", "customer"] as const;
export const TICKET_STATUSES = ["open", "in_progress", "waiting_customer", "closed"] as const;
export const TICKET_PRIORITIES = ["normal", "high", "urgent"] as const;
export const TICKET_CATEGORIES = ["support", "bug", "request", "billing"] as const;
export const LEAD_STATUSES = ["new", "contacted", "quoted", "won", "lost"] as const;
export const LEAD_TOPICS = ["erp", "web", "panel", "unsure"] as const;
export const MAIL_TRANSPORTS = ["mock", "smtp"] as const;
export const SERVICE_KINDS = ["erp", "web", "panel"] as const;
export const PROJECT_STAGES = ["discovery", "design", "development", "testing", "live"] as const;
export const INVOICE_STATUSES = ["pending", "paid", "cancelled"] as const;
export const DOCUMENT_KINDS = ["contract", "proposal", "guide", "report"] as const;
const TICKET_NUMBER_START = 1001;

export const userRole = pgEnum("user_role", USER_ROLES);
export const ticketStatus = pgEnum("ticket_status", TICKET_STATUSES);
export const ticketPriority = pgEnum("ticket_priority", TICKET_PRIORITIES);
export const ticketCategory = pgEnum("ticket_category", TICKET_CATEGORIES);
export const leadStatus = pgEnum("lead_status", LEAD_STATUSES);
export const mailTransport = pgEnum("mail_transport", MAIL_TRANSPORTS);
export const serviceKind = pgEnum("service_kind", SERVICE_KINDS);
export const projectStage = pgEnum("project_stage", PROJECT_STAGES);
export const invoiceStatus = pgEnum("invoice_status", INVOICE_STATUSES);
export const documentKind = pgEnum("document_kind", DOCUMENT_KINDS);

const createdAt = () => timestamp("created_at", { withTimezone: true }).notNull().defaultNow();

export const companies = pgTable("companies", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  createdAt: createdAt(),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),
  role: userRole("role").notNull(),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "restrict" }),
  title: text("title"),
  phone: text("phone"),
  notifyByEmail: boolean("notify_by_email").notNull().default(true),
  createdAt: createdAt(),
});

// id is the SHA-256 of the cookie token, so a leaked table cannot be replayed as cookies
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

export const passwordTokens = pgTable("password_tokens", {
  id: text("id").primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: createdAt(),
});

export const tickets = pgTable(
  "tickets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    number: integer("number").notNull().unique().generatedAlwaysAsIdentity({ startWith: TICKET_NUMBER_START }),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "restrict" }),
    createdById: uuid("created_by_id").notNull().references(() => users.id, { onDelete: "restrict" }),
    assigneeId: uuid("assignee_id").references(() => users.id, { onDelete: "set null" }),
    subject: text("subject").notNull(),
    category: ticketCategory("category").notNull(),
    priority: ticketPriority("priority").notNull().default("normal"),
    status: ticketStatus("status").notNull().default("open"),
    // 1-5, given by the customer after the ticket is closed
    rating: integer("rating"),
    ratingComment: text("rating_comment"),
    createdAt: createdAt(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("tickets_company_idx").on(t.companyId), index("tickets_status_idx").on(t.status)],
);

export const ticketMessages = pgTable(
  "ticket_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ticketId: uuid("ticket_id").notNull().references(() => tickets.id, { onDelete: "cascade" }),
    authorId: uuid("author_id").notNull().references(() => users.id, { onDelete: "restrict" }),
    body: text("body").notNull(),
    // internal notes are visible to staff only
    isInternal: boolean("is_internal").notNull().default(false),
    createdAt: createdAt(),
  },
  (t) => [index("ticket_messages_ticket_idx").on(t.ticketId)],
);

export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  company: text("company"),
  email: text("email").notNull(),
  phone: text("phone"),
  topics: text("topics").array().notNull().default(sql`'{}'::text[]`),
  message: text("message"),
  consentAt: timestamp("consent_at", { withTimezone: true }).notNull(),
  status: leadStatus("status").notNull().default("new"),
  createdAt: createdAt(),
});

export const emailLog = pgTable("email_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  to: text("to").notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  transport: mailTransport("transport").notNull(),
  error: text("error"),
  createdAt: createdAt(),
});

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "restrict" }),
    name: text("name").notNull(),
    service: serviceKind("service").notNull(),
    stage: projectStage("stage").notNull().default("discovery"),
    summary: text("summary").notNull().default(""),
    startsOn: date("starts_on", { mode: "date" }).notNull(),
    dueOn: date("due_on", { mode: "date" }),
    createdAt: createdAt(),
  },
  (t) => [index("projects_company_idx").on(t.companyId)],
);

export const projectMilestones = pgTable("project_milestones", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  dueOn: date("due_on", { mode: "date" }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  position: integer("position").notNull(),
});

export const invoices = pgTable(
  "invoices",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    number: text("number").notNull().unique(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "restrict" }),
    projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
    issuedOn: date("issued_on", { mode: "date" }).notNull(),
    dueOn: date("due_on", { mode: "date" }).notNull(),
    // "overdue" is not stored: it is a pending invoice past its due date
    status: invoiceStatus("status").notNull().default("pending"),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    note: text("note"),
    createdAt: createdAt(),
  },
  (t) => [index("invoices_company_idx").on(t.companyId)],
);

// amounts in kuruş (1/100 TRY), before VAT
export const invoiceLines = pgTable("invoice_lines", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoiceId: uuid("invoice_id").notNull().references(() => invoices.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: integer("unit_price").notNull(),
  position: integer("position").notNull(),
});

export const documents = pgTable(
  "documents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "restrict" }),
    projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    kind: documentKind("kind").notNull(),
    fileName: text("file_name").notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    uploadedById: uuid("uploaded_by_id").notNull().references(() => users.id, { onDelete: "restrict" }),
    createdAt: createdAt(),
  },
  (t) => [index("documents_company_idx").on(t.companyId)],
);

export type User = typeof users.$inferSelect;
export type UserRole = (typeof USER_ROLES)[number];
export type TicketStatus = (typeof TICKET_STATUSES)[number];
export type TicketPriority = (typeof TICKET_PRIORITIES)[number];
export type TicketCategory = (typeof TICKET_CATEGORIES)[number];
export type LeadStatus = (typeof LEAD_STATUSES)[number];
export type LeadTopic = (typeof LEAD_TOPICS)[number];
export type ServiceKind = (typeof SERVICE_KINDS)[number];
export type ProjectStage = (typeof PROJECT_STAGES)[number];
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];
export type DocumentKind = (typeof DOCUMENT_KINDS)[number];
