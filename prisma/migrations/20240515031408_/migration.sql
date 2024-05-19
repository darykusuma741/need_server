-- CreateEnum
CREATE TYPE "StatusPajak" AS ENUM ('TERBAYAR', 'BELUM');

-- CreateEnum
CREATE TYPE "KeteranganPajak" AS ENUM ('APLIKASI', 'AFFILIATE');

-- CreateEnum
CREATE TYPE "MetodePembayaranPajak" AS ENUM ('TRANSDER', 'TUNAI');

-- CreateTable
CREATE TABLE "DataHistoryPajak" (
    "id" SERIAL NOT NULL,
    "id_detail_transaksi" INTEGER NOT NULL,
    "total_pajak" INTEGER NOT NULL,
    "total_transaksi" INTEGER NOT NULL,
    "status" "StatusPajak" NOT NULL,
    "keterangan" "KeteranganPajak" NOT NULL,
    "metode_pembayaran" "MetodePembayaranPajak" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataHistoryPajak_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DataHistoryPajak" ADD CONSTRAINT "DataHistoryPajak_id_detail_transaksi_fkey" FOREIGN KEY ("id_detail_transaksi") REFERENCES "DataDetailTransaksi"("id") ON DELETE CASCADE ON UPDATE CASCADE;
