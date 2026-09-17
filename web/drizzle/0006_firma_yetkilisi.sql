ALTER TABLE "users" ADD COLUMN "is_company_admin" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "removed_at" timestamp with time zone;--> statement-breakpoint
-- Backfill: every company that already has people gets exactly one "firma yetkilisi",
-- its oldest customer user (id breaks ties when two were created in the same statement).
UPDATE "users" SET "is_company_admin" = true WHERE "id" IN (
	SELECT DISTINCT ON ("company_id") "id"
	FROM "users"
	WHERE "role" = 'customer' AND "company_id" IS NOT NULL
	ORDER BY "company_id", "created_at", "id"
);
