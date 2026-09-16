CREATE TYPE "public"."device_connection_kind" AS ENUM('connect', 'file_transfer');--> statement-breakpoint
CREATE TABLE "device_connections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"device_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"kind" "device_connection_kind" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "devices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"desk_id" text NOT NULL,
	"hostname" text NOT NULL,
	"platform" text NOT NULL,
	"app_version" text NOT NULL,
	"unattended_password_enc" text,
	"registered_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_registered_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "devices_desk_id_unique" UNIQUE("desk_id")
);
--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "customer_code" text;--> statement-breakpoint
-- Backfill existing companies with random, unique 6-digit customer numbers (100000-999999).
DO $$
DECLARE
  company record;
  candidate text;
BEGIN
  FOR company IN SELECT "id" FROM "companies" WHERE "customer_code" IS NULL LOOP
    LOOP
      candidate := (100000 + floor(random() * 900000))::int::text;
      EXIT WHEN NOT EXISTS (SELECT 1 FROM "companies" WHERE "customer_code" = candidate);
    END LOOP;
    UPDATE "companies" SET "customer_code" = candidate WHERE "id" = company."id";
  END LOOP;
END $$;--> statement-breakpoint
ALTER TABLE "companies" ALTER COLUMN "customer_code" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "device_connections" ADD CONSTRAINT "device_connections_device_id_devices_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."devices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "device_connections" ADD CONSTRAINT "device_connections_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devices" ADD CONSTRAINT "devices_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "device_connections_device_idx" ON "device_connections" USING btree ("device_id");--> statement-breakpoint
CREATE INDEX "device_connections_created_idx" ON "device_connections" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "devices_company_idx" ON "devices" USING btree ("company_id");--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_customer_code_unique" UNIQUE("customer_code");