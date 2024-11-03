-- CreateTable
CREATE TABLE `Proxy` (
    `ip` VARCHAR(191) NOT NULL,
    `port` INTEGER NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `country` CHAR(2) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `vendor` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`ip`, `port`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProxyIpReservation` (
    `ip` VARCHAR(191) NOT NULL,
    `serviceId` VARCHAR(191) NOT NULL,
    `instanceId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`ip`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
