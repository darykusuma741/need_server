/*
  Warnings:

  - You are about to drop the column `pajak` on the `DataDetailTransaksi` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DataDetailTransaksi" DROP COLUMN "pajak",
ADD COLUMN     "pajak_toko" INTEGER NOT NULL DEFAULT 0;
