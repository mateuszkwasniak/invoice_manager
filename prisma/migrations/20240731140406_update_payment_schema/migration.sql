/*
  Warnings:

  - A unique constraint covering the columns `[id,title]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Payment_id_title_slug_key";

-- DropIndex
DROP INDEX "Payment_slug_key";

-- CreateIndex
CREATE UNIQUE INDEX "Payment_id_title_key" ON "Payment"("id", "title");
