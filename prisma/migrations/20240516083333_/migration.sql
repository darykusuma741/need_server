/*
  Warnings:

  - Made the column `nama` on table `DataUser` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "DataUser" ALTER COLUMN "nama" SET NOT NULL,
ALTER COLUMN "nama" SET DEFAULT '-';
