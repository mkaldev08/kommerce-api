/*
  Warnings:

  - A unique constraint covering the columns `[nif]` on the table `companies` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "companies" ADD COLUMN "image_data" TEXT;
ALTER TABLE "companies" ADD COLUMN "image_type" TEXT;
ALTER TABLE "companies" ADD COLUMN "nif" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "companies_nif_key" ON "companies"("nif");
