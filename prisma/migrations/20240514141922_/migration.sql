/*
  Warnings:

  - Made the column `foto` on table `DataProduk` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "DataProduk" ALTER COLUMN "foto" SET NOT NULL;
