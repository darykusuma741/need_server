-- AddForeignKey
ALTER TABLE "DataUser" ADD CONSTRAINT "DataUser_id_ref_fkey" FOREIGN KEY ("id_ref") REFERENCES "DataUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
