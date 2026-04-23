-- CreateTable
CREATE TABLE `Mentor` (
    `id` VARCHAR(36) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `passwordHash` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Mentor_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mentee` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `accessCode` VARCHAR(50) NOT NULL,
    `domainTrack` VARCHAR(100) NOT NULL,
    `statedGoal` TEXT NULL,
    `goalDomain` VARCHAR(100) NULL,
    `alignmentStatus` VARCHAR(20) NULL,
    `topMatch` VARCHAR(100) NULL,
    `secondMatch` VARCHAR(100) NULL,
    `allScores` JSON NULL,
    `mentorNote` TEXT NULL,
    `startDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `onboardedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `mentorId` VARCHAR(36) NULL,

    UNIQUE INDEX `Mentee_email_key`(`email`),
    UNIQUE INDEX `Mentee_accessCode_key`(`accessCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WeeklySubmission` (
    `id` VARCHAR(36) NOT NULL,
    `menteeId` VARCHAR(36) NOT NULL,
    `weekNumber` INTEGER NOT NULL,
    `summary` TEXT NOT NULL,
    `workDone` TEXT NOT NULL,
    `link` VARCHAR(500) NULL,
    `mentorFeedback` TEXT NULL,
    `feedbackAt` DATETIME(3) NULL,
    `submittedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `WeeklySubmission_menteeId_weekNumber_key`(`menteeId`, `weekNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AssessmentSession` (
    `id` VARCHAR(36) NOT NULL,
    `sessionToken` VARCHAR(36) NOT NULL,
    `name` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `statedGoal` TEXT NULL,
    `answers` JSON NULL,
    `completed` BOOLEAN NOT NULL DEFAULT false,
    `menteeId` VARCHAR(36) NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `AssessmentSession_sessionToken_key`(`sessionToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EmailLog` (
    `id` VARCHAR(36) NOT NULL,
    `menteeId` VARCHAR(36) NULL,
    `emailType` VARCHAR(100) NOT NULL,
    `recipient` VARCHAR(255) NOT NULL,
    `subject` VARCHAR(500) NOT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'queued',
    `providerId` VARCHAR(255) NULL,
    `errorMsg` TEXT NULL,
    `sentAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Mentee` ADD CONSTRAINT `Mentee_mentorId_fkey` FOREIGN KEY (`mentorId`) REFERENCES `Mentor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WeeklySubmission` ADD CONSTRAINT `WeeklySubmission_menteeId_fkey` FOREIGN KEY (`menteeId`) REFERENCES `Mentee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmailLog` ADD CONSTRAINT `EmailLog_menteeId_fkey` FOREIGN KEY (`menteeId`) REFERENCES `Mentee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
