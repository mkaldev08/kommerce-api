/*
  Warnings:

  - Added the required column `updated_at` to the `cash_movements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `cash_movements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `gaming_session_payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `gaming_sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `invoice_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "business_units" ADD COLUMN "deleted_at" DATETIME;

-- AlterTable
ALTER TABLE "cash_registers" ADD COLUMN "deleted_at" DATETIME;

-- AlterTable
ALTER TABLE "companies" ADD COLUMN "deleted_at" DATETIME;

-- AlterTable
ALTER TABLE "enrollments" ADD COLUMN "deleted_at" DATETIME;

-- AlterTable
ALTER TABLE "financial_plans" ADD COLUMN "deleted_at" DATETIME;

-- AlterTable
ALTER TABLE "gaming_consoles" ADD COLUMN "deleted_at" DATETIME;

-- AlterTable
ALTER TABLE "gaming_customers" ADD COLUMN "deleted_at" DATETIME;

-- AlterTable
ALTER TABLE "gaming_expenses" ADD COLUMN "deleted_at" DATETIME;

-- AlterTable
ALTER TABLE "gaming_games" ADD COLUMN "deleted_at" DATETIME;

-- AlterTable
ALTER TABLE "gaming_tournaments" ADD COLUMN "deleted_at" DATETIME;

-- AlterTable
ALTER TABLE "students" ADD COLUMN "deleted_at" DATETIME;

-- AlterTable
ALTER TABLE "users" ADD COLUMN "deleted_at" DATETIME;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_cash_movements" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    "description" TEXT,
    "movement_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cash_register_id" TEXT NOT NULL,
    "user_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    CONSTRAINT "cash_movements_cash_register_id_fkey" FOREIGN KEY ("cash_register_id") REFERENCES "cash_registers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "cash_movements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_cash_movements" ("amount", "cash_register_id", "created_at", "description", "id", "movement_date", "type", "updated_at") SELECT "amount", "cash_register_id", "created_at", "description", "id", "movement_date", "type", CURRENT_TIMESTAMP FROM "cash_movements";
DROP TABLE "cash_movements";
ALTER TABLE "new_cash_movements" RENAME TO "cash_movements";
CREATE INDEX "cash_movements_cash_register_id_idx" ON "cash_movements"("cash_register_id");
CREATE INDEX "cash_movements_user_id_idx" ON "cash_movements"("user_id");
CREATE INDEX "cash_movements_type_idx" ON "cash_movements"("type");
CREATE INDEX "cash_movements_movement_date_idx" ON "cash_movements"("movement_date");
CREATE TABLE "new_gaming_session_payments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "session_id" TEXT NOT NULL,
    "user_id" TEXT,
    "amount" DECIMAL NOT NULL,
    "method" TEXT NOT NULL,
    "payment_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    CONSTRAINT "gaming_session_payments_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "gaming_sessions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "gaming_session_payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_gaming_session_payments" ("amount", "created_at", "id", "method", "payment_date", "session_id", "updated_at") SELECT "amount", "created_at", "id", "method", "payment_date", "session_id", "updated_at" FROM "gaming_session_payments";
DROP TABLE "gaming_session_payments";
ALTER TABLE "new_gaming_session_payments" RENAME TO "gaming_session_payments";
CREATE INDEX "gaming_session_payments_session_id_idx" ON "gaming_session_payments"("session_id");
CREATE INDEX "gaming_session_payments_user_id_idx" ON "gaming_session_payments"("user_id");
CREATE INDEX "gaming_session_payments_method_idx" ON "gaming_session_payments"("method");
CREATE INDEX "gaming_session_payments_payment_date_idx" ON "gaming_session_payments"("payment_date");
CREATE TABLE "new_gaming_sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "business_unit_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "console_id" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,
    "user_id" TEXT,
    "start_time" DATETIME NOT NULL,
    "end_time" DATETIME,
    "duration_minutes" INTEGER,
    "hourly_rate" DECIMAL NOT NULL,
    "total_amount" DECIMAL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    CONSTRAINT "gaming_sessions_business_unit_id_fkey" FOREIGN KEY ("business_unit_id") REFERENCES "business_units" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "gaming_sessions_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "gaming_customers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "gaming_sessions_console_id_fkey" FOREIGN KEY ("console_id") REFERENCES "gaming_consoles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "gaming_sessions_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "gaming_games" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "gaming_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_gaming_sessions" ("business_unit_id", "console_id", "created_at", "customer_id", "duration_minutes", "end_time", "game_id", "hourly_rate", "id", "notes", "start_time", "status", "total_amount", "updated_at") SELECT "business_unit_id", "console_id", "created_at", "customer_id", "duration_minutes", "end_time", "game_id", "hourly_rate", "id", "notes", "start_time", "status", "total_amount", "updated_at" FROM "gaming_sessions";
DROP TABLE "gaming_sessions";
ALTER TABLE "new_gaming_sessions" RENAME TO "gaming_sessions";
CREATE INDEX "gaming_sessions_business_unit_id_idx" ON "gaming_sessions"("business_unit_id");
CREATE INDEX "gaming_sessions_customer_id_idx" ON "gaming_sessions"("customer_id");
CREATE INDEX "gaming_sessions_console_id_idx" ON "gaming_sessions"("console_id");
CREATE INDEX "gaming_sessions_game_id_idx" ON "gaming_sessions"("game_id");
CREATE INDEX "gaming_sessions_user_id_idx" ON "gaming_sessions"("user_id");
CREATE INDEX "gaming_sessions_status_idx" ON "gaming_sessions"("status");
CREATE INDEX "gaming_sessions_start_time_idx" ON "gaming_sessions"("start_time");
CREATE TABLE "new_invoice_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL NOT NULL,
    "vat_rate" DECIMAL NOT NULL,
    "vat_amount" DECIMAL NOT NULL,
    "subtotal" DECIMAL NOT NULL,
    "vat_status" TEXT NOT NULL,
    "invoice_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    CONSTRAINT "invoice_items_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "invoice_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_invoice_items" ("id", "invoice_id", "product_id", "quantity", "subtotal", "unit_price", "vat_amount", "vat_rate", "vat_status", "created_at", "updated_at") SELECT "id", "invoice_id", "product_id", "quantity", "subtotal", "unit_price", "vat_amount", "vat_rate", "vat_status", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP FROM "invoice_items";
DROP TABLE "invoice_items";
ALTER TABLE "new_invoice_items" RENAME TO "invoice_items";
CREATE INDEX "invoice_items_invoice_id_idx" ON "invoice_items"("invoice_id");
CREATE INDEX "invoice_items_product_id_idx" ON "invoice_items"("product_id");
CREATE INDEX "invoice_items_vat_status_idx" ON "invoice_items"("vat_status");
CREATE TABLE "new_invoices" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number" TEXT NOT NULL,
    "series" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "issue_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "taxable_amount" DECIMAL NOT NULL,
    "vat_amount" DECIMAL NOT NULL,
    "total_amount" DECIMAL NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "pending_reason" TEXT,
    "cancel_reason" TEXT,
    "company_id" TEXT NOT NULL,
    "business_unit_id" TEXT NOT NULL,
    "customer_id" TEXT,
    "cash_register_id" TEXT NOT NULL,
    "user_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    CONSTRAINT "invoices_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "invoices_business_unit_id_fkey" FOREIGN KEY ("business_unit_id") REFERENCES "business_units" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "invoices_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "invoices_cash_register_id_fkey" FOREIGN KEY ("cash_register_id") REFERENCES "cash_registers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "invoices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_invoices" ("business_unit_id", "cancel_reason", "cash_register_id", "company_id", "created_at", "customer_id", "id", "issue_date", "number", "pending_reason", "series", "status", "taxable_amount", "total_amount", "type", "updated_at", "vat_amount") SELECT "business_unit_id", "cancel_reason", "cash_register_id", "company_id", "created_at", "customer_id", "id", "issue_date", "number", "pending_reason", "series", "status", "taxable_amount", "total_amount", "type", "updated_at", "vat_amount" FROM "invoices";
DROP TABLE "invoices";
ALTER TABLE "new_invoices" RENAME TO "invoices";
CREATE INDEX "invoices_company_id_idx" ON "invoices"("company_id");
CREATE INDEX "invoices_business_unit_id_idx" ON "invoices"("business_unit_id");
CREATE INDEX "invoices_cash_register_id_idx" ON "invoices"("cash_register_id");
CREATE INDEX "invoices_user_id_idx" ON "invoices"("user_id");
CREATE INDEX "invoices_issue_date_idx" ON "invoices"("issue_date");
CREATE INDEX "invoices_type_idx" ON "invoices"("type");
CREATE INDEX "invoices_status_idx" ON "invoices"("status");
CREATE UNIQUE INDEX "invoices_number_series_key" ON "invoices"("number", "series");
CREATE TABLE "new_payments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" DECIMAL NOT NULL,
    "method" TEXT NOT NULL,
    "payment_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "invoice_id" TEXT NOT NULL,
    "financial_plan_id" TEXT,
    "user_id" TEXT,
    "payment_type" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    CONSTRAINT "payments_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "payments_financial_plan_id_fkey" FOREIGN KEY ("financial_plan_id") REFERENCES "financial_plans" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_payments" ("amount", "created_at", "financial_plan_id", "id", "invoice_id", "method", "payment_date", "payment_type", "updated_at") SELECT "amount", "created_at", "financial_plan_id", "id", "invoice_id", "method", "payment_date", "payment_type", "updated_at" FROM "payments";
DROP TABLE "payments";
ALTER TABLE "new_payments" RENAME TO "payments";
CREATE INDEX "payments_invoice_id_idx" ON "payments"("invoice_id");
CREATE INDEX "payments_user_id_idx" ON "payments"("user_id");
CREATE INDEX "payments_method_idx" ON "payments"("method");
CREATE INDEX "payments_payment_date_idx" ON "payments"("payment_date");
CREATE INDEX "payments_financial_plan_id_idx" ON "payments"("financial_plan_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
