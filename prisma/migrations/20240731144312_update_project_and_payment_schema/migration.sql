/*
  Warnings:

  - A unique constraint covering the columns `[title,projectSlug,userId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,companyId]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,slug]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `projectSlug` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_projectId_fkey";

-- DropIndex
DROP INDEX "Payment_slug_projectId_key";

-- DropIndex
DROP INDEX "Project_name_companyId_userId_key";

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "projectSlug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Payment_title_projectSlug_userId_key" ON "Payment"("title", "projectSlug", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_name_companyId_key" ON "Project"("name", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_id_slug_key" ON "Project"("id", "slug");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_projectId_projectSlug_fkey" FOREIGN KEY ("projectId", "projectSlug") REFERENCES "Project"("id", "slug") ON DELETE CASCADE ON UPDATE CASCADE;
