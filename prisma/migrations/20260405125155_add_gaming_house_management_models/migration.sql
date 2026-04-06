/*
  Warnings:

  - You are about to drop the `app_meta` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "app_meta";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "gaming_customers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone_number" TEXT,
    "notes" TEXT,
    "business_unit_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "gaming_customers_business_unit_id_fkey" FOREIGN KEY ("business_unit_id") REFERENCES "business_units" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "gaming_consoles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "model" TEXT,
    "hourly_rate" DECIMAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "business_unit_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "gaming_consoles_business_unit_id_fkey" FOREIGN KEY ("business_unit_id") REFERENCES "business_units" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "gaming_games" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "genre" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "business_unit_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "gaming_games_business_unit_id_fkey" FOREIGN KEY ("business_unit_id") REFERENCES "business_units" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "gaming_sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "business_unit_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "console_id" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,
    "start_time" DATETIME NOT NULL,
    "end_time" DATETIME,
    "duration_minutes" INTEGER,
    "hourly_rate" DECIMAL NOT NULL,
    "total_amount" DECIMAL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "gaming_sessions_business_unit_id_fkey" FOREIGN KEY ("business_unit_id") REFERENCES "business_units" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "gaming_sessions_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "gaming_customers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "gaming_sessions_console_id_fkey" FOREIGN KEY ("console_id") REFERENCES "gaming_consoles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "gaming_sessions_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "gaming_games" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "gaming_session_payments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "session_id" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    "method" TEXT NOT NULL,
    "payment_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "gaming_session_payments_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "gaming_sessions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "gaming_expenses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "business_unit_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT,
    "amount" DECIMAL NOT NULL,
    "expense_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "gaming_expenses_business_unit_id_fkey" FOREIGN KEY ("business_unit_id") REFERENCES "business_units" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "gaming_tournaments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "business_unit_id" TEXT NOT NULL,
    "game_id" TEXT,
    "name" TEXT NOT NULL,
    "start_date" DATETIME NOT NULL,
    "end_date" DATETIME,
    "entry_fee" DECIMAL,
    "prize_pool" DECIMAL,
    "status" TEXT NOT NULL DEFAULT 'PLANNED',
    "winner_customer_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "gaming_tournaments_business_unit_id_fkey" FOREIGN KEY ("business_unit_id") REFERENCES "business_units" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "gaming_tournaments_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "gaming_games" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "gaming_tournaments_winner_customer_id_fkey" FOREIGN KEY ("winner_customer_id") REFERENCES "gaming_customers" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "gaming_customers_business_unit_id_idx" ON "gaming_customers"("business_unit_id");

-- CreateIndex
CREATE INDEX "gaming_customers_name_idx" ON "gaming_customers"("name");

-- CreateIndex
CREATE INDEX "gaming_consoles_business_unit_id_idx" ON "gaming_consoles"("business_unit_id");

-- CreateIndex
CREATE INDEX "gaming_consoles_status_idx" ON "gaming_consoles"("status");

-- CreateIndex
CREATE UNIQUE INDEX "gaming_consoles_business_unit_id_name_key" ON "gaming_consoles"("business_unit_id", "name");

-- CreateIndex
CREATE INDEX "gaming_games_business_unit_id_idx" ON "gaming_games"("business_unit_id");

-- CreateIndex
CREATE UNIQUE INDEX "gaming_games_business_unit_id_name_key" ON "gaming_games"("business_unit_id", "name");

-- CreateIndex
CREATE INDEX "gaming_sessions_business_unit_id_idx" ON "gaming_sessions"("business_unit_id");

-- CreateIndex
CREATE INDEX "gaming_sessions_customer_id_idx" ON "gaming_sessions"("customer_id");

-- CreateIndex
CREATE INDEX "gaming_sessions_console_id_idx" ON "gaming_sessions"("console_id");

-- CreateIndex
CREATE INDEX "gaming_sessions_game_id_idx" ON "gaming_sessions"("game_id");

-- CreateIndex
CREATE INDEX "gaming_sessions_status_idx" ON "gaming_sessions"("status");

-- CreateIndex
CREATE INDEX "gaming_sessions_start_time_idx" ON "gaming_sessions"("start_time");

-- CreateIndex
CREATE INDEX "gaming_session_payments_session_id_idx" ON "gaming_session_payments"("session_id");

-- CreateIndex
CREATE INDEX "gaming_session_payments_method_idx" ON "gaming_session_payments"("method");

-- CreateIndex
CREATE INDEX "gaming_session_payments_payment_date_idx" ON "gaming_session_payments"("payment_date");

-- CreateIndex
CREATE INDEX "gaming_expenses_business_unit_id_idx" ON "gaming_expenses"("business_unit_id");

-- CreateIndex
CREATE INDEX "gaming_expenses_expense_date_idx" ON "gaming_expenses"("expense_date");

-- CreateIndex
CREATE INDEX "gaming_tournaments_business_unit_id_idx" ON "gaming_tournaments"("business_unit_id");

-- CreateIndex
CREATE INDEX "gaming_tournaments_game_id_idx" ON "gaming_tournaments"("game_id");

-- CreateIndex
CREATE INDEX "gaming_tournaments_status_idx" ON "gaming_tournaments"("status");
