CREATE TABLE "loyalty_ledger" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"amount" bigint NOT NULL,
	"type" text NOT NULL,
	"reference_type" text,
	"reference_id" text,
	"idempotency_key" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "loyalty_wallets" (
	"user_id" integer PRIMARY KEY NOT NULL,
	"balance" bigint DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "loyalty_ledger" ADD CONSTRAINT "loyalty_ledger_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loyalty_wallets" ADD CONSTRAINT "loyalty_wallets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "loyalty_ledger_idempotency_uq" ON "loyalty_ledger" USING btree ("idempotency_key");