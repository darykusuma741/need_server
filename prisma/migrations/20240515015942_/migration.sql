/*
  Warnings:

  - Added the required column `status` to the `DataTransaksi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DataTransaksi" ADD COLUMN     "status" "StatusTransaksi" NOT NULL;
