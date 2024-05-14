-- CreateTable
CREATE TABLE "DataToko" (
    "id" SERIAL NOT NULL,
    "nama_toko" TEXT NOT NULL,
    "alamat_toko" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataToko_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DataToko" ADD CONSTRAINT "DataToko_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "DataUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
