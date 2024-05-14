-- CreateTable
CREATE TABLE "DataProduk" (
    "id" SERIAL NOT NULL,
    "id_toko" INTEGER NOT NULL,
    "id_kategori" INTEGER,
    "nama_produk" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "foto" TEXT,
    "harga" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataProduk_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DataProduk" ADD CONSTRAINT "DataProduk_id_toko_fkey" FOREIGN KEY ("id_toko") REFERENCES "DataToko"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataProduk" ADD CONSTRAINT "DataProduk_id_kategori_fkey" FOREIGN KEY ("id_kategori") REFERENCES "DataKategori"("id") ON DELETE SET NULL ON UPDATE CASCADE;
