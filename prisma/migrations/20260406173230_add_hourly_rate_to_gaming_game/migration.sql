/*
  Warnings:

  - Added the required column `hourly_rate` to the `gaming_games` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_gaming_games" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "genre" TEXT,
    "hourly_rate" DECIMAL NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "business_unit_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    CONSTRAINT "gaming_games_business_unit_id_fkey" FOREIGN KEY ("business_unit_id") REFERENCES "business_units" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_gaming_games" ("business_unit_id", "created_at", "deleted_at", "genre", "id", "is_active", "name", "updated_at") SELECT "business_unit_id", "created_at", "deleted_at", "genre", "id", "is_active", "name", "updated_at" FROM "gaming_games";
DROP TABLE "gaming_games";
ALTER TABLE "new_gaming_games" RENAME TO "gaming_games";
CREATE INDEX "gaming_games_business_unit_id_idx" ON "gaming_games"("business_unit_id");
CREATE UNIQUE INDEX "gaming_games_business_unit_id_name_key" ON "gaming_games"("business_unit_id", "name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
