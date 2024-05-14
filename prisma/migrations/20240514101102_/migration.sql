/*
  Warnings:

  - A unique constraint covering the columns `[no_hp]` on the table `DataUser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DataUser_no_hp_key" ON "DataUser"("no_hp");
