ALTER TABLE "device_connections" ADD COLUMN "ticket_id" uuid;--> statement-breakpoint
ALTER TABLE "devices" ADD COLUMN "user_id" uuid;--> statement-breakpoint
ALTER TABLE "devices" ADD COLUMN "contact_name" text;--> statement-breakpoint
ALTER TABLE "devices" ADD COLUMN "label" text;--> statement-breakpoint
ALTER TABLE "devices" ADD COLUMN "device_token_hash" text;--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "device_id" uuid;--> statement-breakpoint
ALTER TABLE "device_connections" ADD CONSTRAINT "device_connections_ticket_id_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devices" ADD CONSTRAINT "devices_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_device_id_devices_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."devices"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "devices_user_idx" ON "devices" USING btree ("user_id");