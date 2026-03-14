/*
  Warnings:

  - Added the required column `business_unit_id` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "invoices_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "invoices_business_unit_id_fkey" FOREIGN KEY ("business_unit_id") REFERENCES "business_units" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "invoices_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "invoices_cash_register_id_fkey" FOREIGN KEY ("cash_register_id") REFERENCES "cash_registers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_invoices" ("business_unit_id", "cancel_reason", "cash_register_id", "company_id", "created_at", "customer_id", "id", "issue_date", "number", "pending_reason", "series", "status", "taxable_amount", "total_amount", "type", "updated_at", "vat_amount") SELECT "business_unit_id", "cancel_reason", "cash_register_id", "company_id", "created_at", "customer_id", "id", "issue_date", "number", "pending_reason", "series", "status", "taxable_amount", "total_amount", "type", "updated_at", "vat_amount" FROM "invoices";
DROP TABLE "invoices";
ALTER TABLE "new_invoices" RENAME TO "invoices";
CREATE INDEX "invoices_company_id_idx" ON "invoices"("company_id");
CREATE INDEX "invoices_business_unit_id_idx" ON "invoices"("business_unit_id");
CREATE INDEX "invoices_cash_register_id_idx" ON "invoices"("cash_register_id");
CREATE INDEX "invoices_issue_date_idx" ON "invoices"("issue_date");
CREATE INDEX "invoices_type_idx" ON "invoices"("type");
CREATE INDEX "invoices_status_idx" ON "invoices"("status");
CREATE UNIQUE INDEX "invoices_number_series_key" ON "invoices"("number", "series");
CREATE TABLE "new_students" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "guardian_name" TEXT,
    "guardian_phone_number" TEXT,
    "notes" TEXT,
    "business_unit_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "students_business_unit_id_fkey" FOREIGN KEY ("business_unit_id") REFERENCES "business_units" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_students" ("created_at", "email", "first_name", "id", "last_name", "phone", "updated_at") SELECT "created_at", "email", "first_name", "id", "last_name", "phone", "updated_at" FROM "students";
DROP TABLE "students";
ALTER TABLE "new_students" RENAME TO "students";
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");
CREATE INDEX "students_business_unit_id_idx" ON "students"("business_unit_id");
CREATE UNIQUE INDEX "students_first_name_last_name_business_unit_id_key" ON "students"("first_name", "last_name", "business_unit_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
