/*
  Warnings:

  - A unique constraint covering the columns `[slug,userId]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug,projectId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug,companyId]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Company_name_userId_key";

-- DropIndex
DROP INDEX "Payment_title_projectId_key";

-- DropIndex
DROP INDEX "Project_name_companyId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Company_slug_userId_key" ON "Company"("slug", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_slug_projectId_key" ON "Payment"("slug", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_companyId_key" ON "Project"("slug", "companyId");
