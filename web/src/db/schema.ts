import { sql } from "drizzle-orm";
import { boolean, date, index, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const USER_ROLES = ["staff", "customer"] as const;
export const TICKET_STATUSES = ["open", "in_progress", "waiting_customer", "closed"] as const;
export const TICKET_PRIORITIES = ["normal", "high", "urgent"] as const;
export const TICKET_CATEGORIES = ["support", "bug", "request", "billing"] as const;
export const LEAD_STATUSES = ["new", "contacted", "quoted", "won", "lost"] as const;
export const LEAD_TOPICS = ["bilgi", "demo", "teklif", "destek", "ortaklik", "diger"] as const;
export const MAIL_TRANSPORTS = ["mock", "smtp"] as const;
export const SERVICE_KINDS = ["erp", "web", "panel"] as const;
export const PROJECT_STAGES = ["discovery", "design", "development", "testing", "live"] as const;
export const INVOICE_STATUSES = ["pending", "paid", "cancelled"] as const;
export const DOCUMENT_KINDS = ["contract", "proposal", "guide", "report"] as const;
export const DEVICE_CONNECTION_KINDS = ["connect", "file_transfer"] as const;
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
export const deviceConnectionKind = pgEnum("device_connection_kind", DEVICE_CONNECTION_KINDS);

const createdAt = () => timestamp("created_at", { withTimezone: true }).notNull().defaultNow();

export const companies = pgTable("companies", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  // 6-digit number the customer types into GoTech Desk to register a computer
  customerCode: text("customer_code").notNull().unique(),
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
  // "firma yetkilisi": the person who manages their company's people. Only meaningful for role = "customer".
  isCompanyAdmin: boolean("is_company_admin").notNull().default(false),
  // soft removal: the person can no longer sign in, but their tickets, messages and history stay intact
  removedAt: timestamp("removed_at", { withTimezone: true }),
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

// One-click GoTech Desk setup: the link a person gets registers their computer to them without a password.
// id is the SHA-256 of the token in the link and in the installer's file name; used once, then dead.
export const deskSetupLinks = pgTable("desk_setup_links", {
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
    // set when the customer asked for help from the GoTech Desk app on that computer
    deviceId: uuid("device_id").references(() => devices.id, { onDelete: "set null" }),
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

// Files attached to ticket messages and project updates. Stored on disk under UPLOAD_DIR by storage_key; the original name is only shown.
// ticket_id, message_id and project_update_id all stay null ("pending") from upload until the message or update is sent.
export const ticketAttachments = pgTable(
  "ticket_attachments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "restrict" }),
    ticketId: uuid("ticket_id").references(() => tickets.id, { onDelete: "cascade" }),
    messageId: uuid("message_id").references(() => ticketMessages.id, { onDelete: "cascade" }),
    projectUpdateId: uuid("project_update_id").references(() => projectUpdates.id, { onDelete: "cascade" }),
    uploadedById: uuid("uploaded_by_id").notNull().references(() => users.id, { onDelete: "restrict" }),
    originalName: text("original_name").notNull(),
    mimeType: text("mime_type").notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    storageKey: text("storage_key").notNull().unique(),
    createdAt: createdAt(),
  },
  (t) => [
    index("ticket_attachments_company_idx").on(t.companyId),
    index("ticket_attachments_message_idx").on(t.messageId),
    index("ticket_attachments_project_update_idx").on(t.projectUpdateId),
  ],
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
    // the GoTech team member responsible for the project
    assigneeId: uuid("assignee_id").references(() => users.id, { onDelete: "set null" }),
    startsOn: date("starts_on", { mode: "date" }).notNull(),
    dueOn: date("due_on", { mode: "date" }),
    createdAt: createdAt(),
  },
  (t) => [index("projects_company_idx").on(t.companyId), index("projects_assignee_idx").on(t.assigneeId)],
);

export const projectMilestones = pgTable("project_milestones", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  dueOn: date("due_on", { mode: "date" }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  position: integer("position").notNull(),
});

// Progress notes the team writes on a project; internal ones are visible to staff only.
export const projectUpdates = pgTable(
  "project_updates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
    authorId: uuid("author_id").notNull().references(() => users.id, { onDelete: "restrict" }),
    body: text("body").notNull(),
    isInternal: boolean("is_internal").notNull().default(false),
    createdAt: createdAt(),
  },
  (t) => [index("project_updates_project_idx").on(t.projectId)],
);

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

// Computers running GoTech Desk (our RustDesk fork), registered by the desktop app with a company code
export const devices = pgTable(
  "devices",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "restrict" }),
    // the person using this computer: a panel user of the company, or just a name when they have no account
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    contactName: text("contact_name"),
    // for shared computers, e.g. "Resepsiyon"
    label: text("label"),
    // SHA-256 of the token the app got at registration (see lib/auth/tokens); null for devices registered before tokens existed
    deviceTokenHash: text("device_token_hash"),
    deskId: text("desk_id").notNull().unique(),
    hostname: text("hostname").notNull(),
    platform: text("platform").notNull(),
    appVersion: text("app_version").notNull(),
    // AES-256-GCM, see lib/desk/crypto; null when the customer has unattended access turned off
    unattendedPasswordEnc: text("unattended_password_enc"),
    // SHA-256 of the app's machine UUID (sent with heartbeats); the RustDesk connection audit carries only desk ID + UUID
    deviceUuidHash: text("device_uuid_hash"),
    registeredAt: timestamp("registered_at", { withTimezone: true }).notNull().defaultNow(),
    lastRegisteredAt: timestamp("last_registered_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: createdAt(),
  },
  (t) => [index("devices_company_idx").on(t.companyId), index("devices_user_idx").on(t.userId)],
);

// Computers of the GoTech team. The desktop app puts these desk IDs into RustDesk's ID whitelist,
// so once a customer computer locks itself to GoTech only our machines can connect to it.
export const staffDevices = pgTable(
  "staff_devices",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    deskId: text("desk_id").notNull().unique(),
    // what the team member calls this computer, e.g. "Ofis masaüstü"
    label: text("label").notNull(),
    createdAt: createdAt(),
  },
  (t) => [index("staff_devices_user_idx").on(t.userId)],
);

export const deviceConnections = pgTable(
  "device_connections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    deviceId: uuid("device_id").notNull().references(() => devices.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "restrict" }),
    kind: deviceConnectionKind("kind").notNull(),
    // the ticket the connection was opened from, if any
    ticketId: uuid("ticket_id").references(() => tickets.id, { onDelete: "set null" }),
    createdAt: createdAt(),
  },
  (t) => [index("device_connections_device_idx").on(t.deviceId), index("device_connections_created_idx").on(t.createdAt)],
);

// Sessions on a customer computer, as its GoTech Desk app reports them (RustDesk connection audit, /api/audit/conn):
// who connected from which computer, and from when to when.
export const deskSessions = pgTable(
  "desk_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    deviceId: uuid("device_id").notNull().references(() => devices.id, { onDelete: "cascade" }),
    // the app's connection number; it starts over when the app restarts, so only the newest open row is matched
    connId: integer("conn_id").notNull(),
    // the audit record that opened the row: a retried post must not open a second one
    nonce: text("nonce").notNull().unique(),
    ip: text("ip"),
    peerDeskId: text("peer_desk_id"),
    peerName: text("peer_name"),
    // set when the connecting computer is one of the GoTech team's
    staffUserId: uuid("staff_user_id").references(() => users.id, { onDelete: "set null" }),
    // RustDesk's audit type: 0 remote control, 1 file transfer, 2 port forward, 3 camera, 4 terminal
    connType: integer("conn_type"),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    authorizedAt: timestamp("authorized_at", { withTimezone: true }),
    endedAt: timestamp("ended_at", { withTimezone: true }),
  },
  (t) => [index("desk_sessions_device_idx").on(t.deviceId, t.startedAt)],
);

// Kurumsal sitenin yönetim panelinden düzenlenen metinleri: anahtar, koddaki varsayılanın adı
// (DEFAULT_SITE_SETTINGS / DEFAULT_SITE_CONTENT). Burada satırı olmayan alan varsayılanıyla görünür.
export const siteTexts = pgTable("site_texts", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});


export type User = typeof users.$inferSelect;
export type TicketAttachment = typeof ticketAttachments.$inferSelect;
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
export type DeviceConnectionKind = (typeof DEVICE_CONNECTION_KINDS)[number];
