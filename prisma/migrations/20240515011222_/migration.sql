/*
  Warnings:

  - You are about to drop the column `qty` on the `DataTransaksi` table. All the data in the column will be lost.
  - Added the required column `sub_total` to the `DataTransaksi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `DataTransaksi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DataTransaksi" DROP COLUMN "qty",
ADD COLUMN     "sub_total" INTEGER NOT NULL,
ADD COLUMN     "total" INTEGER NOT NULL;
