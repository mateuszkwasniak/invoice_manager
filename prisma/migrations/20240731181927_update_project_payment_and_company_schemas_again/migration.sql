/*
  Warnings:

  - You are about to drop the column `companySlug` on the `Project` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_projectId_projectSlug_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_companyId_companySlug_fkey";

-- DropIndex
DROP INDEX "Company_id_slug_key";

-- DropIndex
DROP INDEX "Payment_slug_projectSlug_userId_key";

-- DropIndex
DROP INDEX "Project_id_slug_key";

-- DropIndex
DROP INDEX "Project_slug_companySlug_userId_key";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "companySlug";

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
