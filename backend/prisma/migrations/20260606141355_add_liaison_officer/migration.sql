-- AlterTable
ALTER TABLE "Mentee" ADD COLUMN     "liaisonOfficerId" TEXT;

-- CreateTable
CREATE TABLE "LiaisonOfficer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LiaisonOfficer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LiaisonOfficer_email_key" ON "LiaisonOfficer"("email");

-- AddForeignKey
ALTER TABLE "Mentee" ADD CONSTRAINT "Mentee_liaisonOfficerId_fkey" FOREIGN KEY ("liaisonOfficerId") REFERENCES "LiaisonOfficer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
