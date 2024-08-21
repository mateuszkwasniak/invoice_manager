/*
  Warnings:

  - A unique constraint covering the columns `[id,title,projectId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Payment_id_title_key";

-- CreateIndex
CREATE UNIQUE INDEX "Payment_id_title_projectId_key" ON "Payment"("id", "title", "projectId");
