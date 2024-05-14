-- CreateEnum
CREATE TYPE "Role" AS ENUM ('TOKO', 'CUSTOMER');

-- CreateTable
CREATE TABLE "DataUser" (
    "id" TEXT NOT NULL,
    "nama" TEXT,
    "role" "Role" NOT NULL,
    "no_hp" TEXT NOT NULL,
    "id_ref" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataUser_pkey" PRIMARY KEY ("id")
);
