/*
  Warnings:

  - Added the required column `municipality_id` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_addresses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "street" TEXT NOT NULL,
    "zip_code" TEXT,
    "municipality_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "addresses_municipality_id_fkey" FOREIGN KEY ("municipality_id") REFERENCES "municipalities" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_addresses" ("created_at", "id", "street", "updated_at", "zip_code") SELECT "created_at", "id", "street", "updated_at", "zip_code" FROM "addresses";
DROP TABLE "addresses";
ALTER TABLE "new_addresses" RENAME TO "addresses";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
