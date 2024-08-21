/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Payment_slug_key" ON "Payment"("slug");
