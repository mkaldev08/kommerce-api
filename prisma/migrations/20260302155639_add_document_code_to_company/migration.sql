/*
  Warnings:

  - Added the required column `document_code` to the `companies` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_companies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "legal_name" TEXT NOT NULL,
    "trade_name" TEXT NOT NULL,
    "commercial_registry" TEXT NOT NULL,
    "document_code" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "vat_regime" TEXT NOT NULL,
    "share_capital" DECIMAL NOT NULL,
    "street_address" TEXT NOT NULL,
    "postal_code" TEXT,
    "municipality_id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "companies_municipality_id_fkey" FOREIGN KEY ("municipality_id") REFERENCES "Municipality" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "companies_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_companies" ("commercial_registry", "created_at", "email", "id", "legal_name", "municipality_id", "owner_id", "phone_number", "postal_code", "share_capital", "street_address", "trade_name", "updated_at", "vat_regime") SELECT "commercial_registry", "created_at", "email", "id", "legal_name", "municipality_id", "owner_id", "phone_number", "postal_code", "share_capital", "street_address", "trade_name", "updated_at", "vat_regime" FROM "companies";
DROP TABLE "companies";
ALTER TABLE "new_companies" RENAME TO "companies";
CREATE UNIQUE INDEX "companies_commercial_registry_key" ON "companies"("commercial_registry");
CREATE INDEX "companies_owner_id_idx" ON "companies"("owner_id");
CREATE INDEX "companies_municipality_id_idx" ON "companies"("municipality_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
