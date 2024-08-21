/*
  Warnings:

  - You are about to drop the column `projectId` on the `Budget` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `details` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `files` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Project` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[companyId,type]` on the table `Budget` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug,projectId]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug,companyId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug,userId]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,userId]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyId` to the `Budget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Budget" DROP CONSTRAINT "Budget_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_companyId_fkey";

-- DropIndex
DROP INDEX "Budget_projectId_type_key";

-- DropIndex
DROP INDEX "Company_name_userId_key";

-- DropIndex
DROP INDEX "Company_slug_userId_key";

-- DropIndex
DROP INDEX "Payment_slug_projectId_key";

-- DropIndex
DROP INDEX "Project_slug_companyId_key";

-- AlterTable
ALTER TABLE "Budget" DROP COLUMN "projectId",
ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "details" VARCHAR(5000),
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "files" TEXT[],
ADD COLUMN     "projectId" TEXT NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "projectId",
ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "companyId",
DROP COLUMN "details",
DROP COLUMN "endDate",
DROP COLUMN "files",
DROP COLUMN "startDate";

-- CreateIndex
CREATE UNIQUE INDEX "Budget_companyId_type_key" ON "Budget"("companyId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Company_slug_projectId_key" ON "Company"("slug", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_slug_companyId_key" ON "Payment"("slug", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_userId_key" ON "Project"("slug", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_name_userId_key" ON "Project"("name", "userId");

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
