/*
  Warnings:

  - A unique constraint covering the columns `[title,projectId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Payment_id_title_projectId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Payment_title_projectId_key" ON "Payment"("title", "projectId");
