/*
  Warnings:

  - You are about to drop the `addresses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `contacts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `address_id` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `contacts_id` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `address_id` on the `costumers` table. All the data in the column will be lost.
  - You are about to drop the column `address_id` on the `suppliers` table. All the data in the column will be lost.
  - You are about to drop the column `contact_id` on the `suppliers` table. All the data in the column will be lost.
  - Added the required column `municipality_id` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `municipality_id` to the `costumers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `municipality_id` to the `suppliers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `suppliers` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "contacts_phone_number_key";

-- DropIndex
DROP INDEX "contacts_email_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "addresses";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "contacts";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_companies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nif" TEXT NOT NULL,
    "social_reason" TEXT NOT NULL,
    "registration_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "website" TEXT,
    "updated_at" DATETIME NOT NULL,
    "regime" TEXT NOT NULL DEFAULT 'SIMPLIFICADO',
    "user_owner_id" TEXT NOT NULL,
    "document_code" TEXT NOT NULL,
    "social_capital" REAL NOT NULL DEFAULT 0,
    "street" TEXT NOT NULL,
    "zip_code" TEXT,
    "municipality_id" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    CONSTRAINT "companies_user_owner_id_fkey" FOREIGN KEY ("user_owner_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "companies_municipality_id_fkey" FOREIGN KEY ("municipality_id") REFERENCES "municipalities" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_companies" ("created_at", "document_code", "email", "id", "name", "nif", "regime", "registration_number", "social_capital", "social_reason", "updated_at", "user_owner_id", "website") SELECT "created_at", "document_code", "email", "id", "name", "nif", "regime", "registration_number", "social_capital", "social_reason", "updated_at", "user_owner_id", "website" FROM "companies";
DROP TABLE "companies";
ALTER TABLE "new_companies" RENAME TO "companies";
CREATE UNIQUE INDEX "companies_name_key" ON "companies"("name");
CREATE UNIQUE INDEX "companies_nif_key" ON "companies"("nif");
CREATE UNIQUE INDEX "companies_registration_number_key" ON "companies"("registration_number");
CREATE UNIQUE INDEX "companies_email_key" ON "companies"("email");
CREATE UNIQUE INDEX "companies_document_code_key" ON "companies"("document_code");
CREATE UNIQUE INDEX "companies_phone_number_key" ON "companies"("phone_number");
CREATE TABLE "new_costumers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "first_name" TEXT,
    "last_name" TEXT DEFAULT 'Consumidor Final',
    "nif" TEXT NOT NULL,
    "costumer_type" TEXT NOT NULL,
    "email" TEXT,
    "phone_number" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "street" TEXT,
    "zip_code" TEXT,
    "municipality_id" TEXT NOT NULL,
    CONSTRAINT "costumers_municipality_id_fkey" FOREIGN KEY ("municipality_id") REFERENCES "municipalities" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_costumers" ("costumer_type", "created_at", "email", "first_name", "id", "last_name", "nif", "phone_number", "updated_at") SELECT "costumer_type", "created_at", "email", "first_name", "id", "last_name", "nif", "phone_number", "updated_at" FROM "costumers";
DROP TABLE "costumers";
ALTER TABLE "new_costumers" RENAME TO "costumers";
CREATE UNIQUE INDEX "costumers_nif_key" ON "costumers"("nif");
CREATE UNIQUE INDEX "costumers_email_key" ON "costumers"("email");
CREATE UNIQUE INDEX "costumers_phone_number_key" ON "costumers"("phone_number");
CREATE UNIQUE INDEX "costumers_first_name_last_name_key" ON "costumers"("first_name", "last_name");
CREATE TABLE "new_suppliers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nif" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "street" TEXT NOT NULL,
    "zip_code" TEXT,
    "municipality_id" TEXT NOT NULL,
    CONSTRAINT "suppliers_municipality_id_fkey" FOREIGN KEY ("municipality_id") REFERENCES "municipalities" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_suppliers" ("created_at", "id", "name", "nif", "updated_at") SELECT "created_at", "id", "name", "nif", "updated_at" FROM "suppliers";
DROP TABLE "suppliers";
ALTER TABLE "new_suppliers" RENAME TO "suppliers";
CREATE UNIQUE INDEX "suppliers_nif_key" ON "suppliers"("nif");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
