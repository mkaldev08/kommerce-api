-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_students" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "guardian_name" TEXT,
    "guardian_phone_number" TEXT,
    "notes" TEXT,
    "student_number" TEXT NOT NULL,
    "business_unit_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "students_business_unit_id_fkey" FOREIGN KEY ("business_unit_id") REFERENCES "business_units" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "new_students" (
    "id",
    "first_name",
    "last_name",
    "email",
    "phone",
    "guardian_name",
    "guardian_phone_number",
    "notes",
    "student_number",
    "business_unit_id",
    "created_at",
    "updated_at"
)
SELECT
    "id",
    "first_name",
    "last_name",
    "email",
    "phone",
    "guardian_name",
    "guardian_phone_number",
    "notes",
    (
      CAST(strftime('%Y', 'now') AS TEXT) || '-' ||
      COALESCE(NULLIF(upper(substr(trim("first_name"), 1, 1)), ''), 'X') || '-' ||
      COALESCE(NULLIF(upper(substr(trim("last_name"), 1, 1)), ''), 'X') || '-' ||
      printf('%04d', "row_number_seq")
    ) AS "student_number",
    "business_unit_id",
    "created_at",
    "updated_at"
FROM (
    SELECT
      s.*,
      row_number() OVER (ORDER BY s."created_at", s."id") AS "row_number_seq"
    FROM "students" s
);

DROP TABLE "students";
ALTER TABLE "new_students" RENAME TO "students";

CREATE UNIQUE INDEX "students_email_key" ON "students"("email");
CREATE UNIQUE INDEX "students_student_number_key" ON "students"("student_number");
CREATE INDEX "students_business_unit_id_idx" ON "students"("business_unit_id");
CREATE INDEX "students_student_number_idx" ON "students"("student_number");
CREATE UNIQUE INDEX "students_first_name_last_name_business_unit_id_key" ON "students"("first_name", "last_name", "business_unit_id");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
