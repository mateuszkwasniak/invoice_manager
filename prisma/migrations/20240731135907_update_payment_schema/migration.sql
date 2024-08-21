/*
  Warnings:

  - A unique constraint covering the columns `[id,title,slug]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Payment_id_title_slug_key" ON "Payment"("id", "title", "slug");
