-- AlterTable
ALTER TABLE "DataHistoryPajak" ADD COLUMN     "id_user_affiliate" TEXT;

-- AddForeignKey
ALTER TABLE "DataHistoryPajak" ADD CONSTRAINT "DataHistoryPajak_id_user_affiliate_fkey" FOREIGN KEY ("id_user_affiliate") REFERENCES "DataUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
