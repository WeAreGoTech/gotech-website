CREATE TABLE "desk_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"device_id" uuid NOT NULL,
	"conn_id" integer NOT NULL,
	"nonce" text NOT NULL,
	"ip" text,
	"peer_desk_id" text,
	"peer_name" text,
	"staff_user_id" uuid,
	"conn_type" integer,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"authorized_at" timestamp with time zone,
	"ended_at" timestamp with time zone,
	CONSTRAINT "desk_sessions_nonce_unique" UNIQUE("nonce")
);
--> statement-breakpoint
ALTER TABLE "devices" ADD COLUMN "device_uuid_hash" text;--> statement-breakpoint
ALTER TABLE "desk_sessions" ADD CONSTRAINT "desk_sessions_device_id_devices_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."devices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "desk_sessions" ADD CONSTRAINT "desk_sessions_staff_user_id_users_id_fk" FOREIGN KEY ("staff_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "desk_sessions_device_idx" ON "desk_sessions" USING btree ("device_id","started_at");