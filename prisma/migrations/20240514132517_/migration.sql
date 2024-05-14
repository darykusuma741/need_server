-- CreateTable
CREATE TABLE "DataKategori" (
    "id" SERIAL NOT NULL,
    "kategori" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataKategori_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DataKategori_kategori_key" ON "DataKategori"("kategori");
