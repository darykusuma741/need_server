/*
  Warnings:

  - The values [TRANSDER] on the enum `MetodePembayaranPajak` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MetodePembayaranPajak_new" AS ENUM ('TRANSFER', 'TUNAI');
ALTER TABLE "DataHistoryPajak" ALTER COLUMN "metode_pembayaran" TYPE "MetodePembayaranPajak_new" USING ("metode_pembayaran"::text::"MetodePembayaranPajak_new");
ALTER TYPE "MetodePembayaranPajak" RENAME TO "MetodePembayaranPajak_old";
ALTER TYPE "MetodePembayaranPajak_new" RENAME TO "MetodePembayaranPajak";
DROP TYPE "MetodePembayaranPajak_old";
COMMIT;
