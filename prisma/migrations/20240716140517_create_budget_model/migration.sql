/*
  Warnings:

  - A unique constraint covering the columns `[name,companyId,userId]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Budget" DROP CONSTRAINT "Budget_projectId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Project_name_companyId_userId_key" ON "Project"("name", "companyId", "userId");

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
