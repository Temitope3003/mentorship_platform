-- AlterTable
ALTER TABLE "Mentee" ADD COLUMN     "certificateCode" TEXT,
ADD COLUMN     "certificateIssuedAt" TIMESTAMP(3),
ADD COLUMN     "hasReceivedCertificate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paymentReference" TEXT,
ADD COLUMN     "pendingPaymentPlan" TEXT,
ADD COLUMN     "pendingPaymentSubmittedAt" TIMESTAMP(3),
ADD COLUMN     "plan" TEXT NOT NULL DEFAULT 'FREE',
ADD COLUMN     "planExpiresAt" TIMESTAMP(3),
ADD COLUMN     "premiumActivatedAt" TIMESTAMP(3),
ADD COLUMN     "premiumActivatedBy" TEXT;
