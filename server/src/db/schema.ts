import {
  bigint,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  phone: text("phone").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const loyaltyWallets = pgTable("loyalty_wallets", {
  userId: integer("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  balance: bigint("balance", { mode: "number" }).notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const loyaltyLedger = pgTable(
  "loyalty_ledger",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    amount: bigint("amount", { mode: "number" }).notNull(),
    type: text("type").notNull(), // "earn" | "spend" | "refund" | "expire" | "adjust"
    referenceType: text("reference_type"),
    referenceId: text("reference_id"),
    idempotencyKey: text("idempotency_key").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [uniqueIndex("loyalty_ledger_idempotency_uq").on(t.idempotencyKey)],
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type LoyaltyWallet = typeof loyaltyWallets.$inferSelect;
export type LoyaltyLedgerRow = typeof loyaltyLedger.$inferSelect;
