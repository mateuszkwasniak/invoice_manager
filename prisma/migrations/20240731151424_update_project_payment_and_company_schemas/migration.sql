/*
  Warnings:

  - A unique constraint covering the columns `[id,slug]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title,projectId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug,projectSlug,userId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug,companySlug,userId]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companySlug` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_companyId_fkey";

-- DropIndex
DROP INDEX "Payment_title_projectSlug_userId_key";

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "slug" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "companySlug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Company_id_slug_key" ON "Company"("id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_title_projectId_key" ON "Payment"("title", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_slug_projectSlug_userId_key" ON "Payment"("slug", "projectSlug", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_companySlug_userId_key" ON "Project"("slug", "companySlug", "userId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_companyId_companySlug_fkey" FOREIGN KEY ("companyId", "companySlug") REFERENCES "Company"("id", "slug") ON DELETE CASCADE ON UPDATE CASCADE;
