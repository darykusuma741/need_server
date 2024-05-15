-- CreateEnum
CREATE TYPE "StatusTransaksi" AS ENUM ('MENUNGGU', 'DIPROSES', 'SELESAI', 'DIBATALKAN');

-- CreateTable
CREATE TABLE "DataTransaksi" (
    "id" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataTransaksi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataDetailTransaksi" (
    "id" SERIAL NOT NULL,
    "id_transaksi" TEXT NOT NULL,
    "id_produk" INTEGER NOT NULL,
    "id_toko" INTEGER NOT NULL,
    "id_kategori" INTEGER,
    "nama_produk" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "foto" TEXT NOT NULL,
    "harga" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataDetailTransaksi_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DataTransaksi" ADD CONSTRAINT "DataTransaksi_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "DataUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataDetailTransaksi" ADD CONSTRAINT "DataDetailTransaksi_id_transaksi_fkey" FOREIGN KEY ("id_transaksi") REFERENCES "DataTransaksi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataDetailTransaksi" ADD CONSTRAINT "DataDetailTransaksi_id_produk_fkey" FOREIGN KEY ("id_produk") REFERENCES "DataProduk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataDetailTransaksi" ADD CONSTRAINT "DataDetailTransaksi_id_toko_fkey" FOREIGN KEY ("id_toko") REFERENCES "DataToko"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataDetailTransaksi" ADD CONSTRAINT "DataDetailTransaksi_id_kategori_fkey" FOREIGN KEY ("id_kategori") REFERENCES "DataKategori"("id") ON DELETE SET NULL ON UPDATE CASCADE;
