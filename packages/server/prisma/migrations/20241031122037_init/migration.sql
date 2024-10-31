-- CreateTable
CREATE TABLE `Proxy` (
    `ip` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`ip`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProxyReservation` (
    `ip` VARCHAR(191) NOT NULL,
    `serviceId` VARCHAR(191) NOT NULL,
    `instanceId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`ip`, `serviceId`, `instanceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
