-- AlterTable
ALTER TABLE "Mentor" ADD COLUMN     "certificateCode" TEXT,
ADD COLUMN     "certificateIssuedAt" TIMESTAMP(3),
ADD COLUMN     "hasReceivedCertificate" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "MentorChatMessage" (
    "id" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MentorChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MentorChatMessage_mentorId_createdAt_idx" ON "MentorChatMessage"("mentorId", "createdAt");

-- AddForeignKey
ALTER TABLE "MentorChatMessage" ADD CONSTRAINT "MentorChatMessage_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "Mentor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
