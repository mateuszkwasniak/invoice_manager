/*
  Warnings:

  - Added the required column `price` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "price" DECIMAL(10,2) NOT NULL;
