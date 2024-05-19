-- CreateEnum
CREATE TYPE "StatusUser" AS ENUM ('NS', 'NEM', 'NET');

-- AlterTable
ALTER TABLE "DataUser" ADD COLUMN     "status" "StatusUser";
