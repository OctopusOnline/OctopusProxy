/*
  Warnings:

  - The primary key for the `ProxyIpReservation` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `ProxyIpReservation` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`ip`, `serviceId`);
