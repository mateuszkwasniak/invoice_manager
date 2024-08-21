/*
  Warnings:

  - Added the required column `type` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('materials', 'services');

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "type" "PaymentType" NOT NULL;
