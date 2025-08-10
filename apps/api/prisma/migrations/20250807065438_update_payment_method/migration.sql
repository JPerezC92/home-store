/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `payment_method` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "payment_method" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "payment_method_name_key" ON "payment_method"("name");

-- CreateIndex
CREATE INDEX "payment_method_name_active_idx" ON "payment_method"("name", "active");
