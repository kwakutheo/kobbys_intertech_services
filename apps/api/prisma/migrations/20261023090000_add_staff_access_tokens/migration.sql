-- AlterTable
ALTER TABLE "User" ADD COLUMN "displayName" TEXT;

-- CreateEnum
CREATE TYPE "StaffAccessTokenPurpose" AS ENUM ('INVITATION', 'PASSWORD_RESET');

-- CreateTable
CREATE TABLE "StaffAccessToken" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "purpose" "StaffAccessTokenPurpose" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StaffAccessToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StaffAccessToken_tokenHash_key" ON "StaffAccessToken"("tokenHash");
CREATE INDEX "StaffAccessToken_userId_purpose_expiresAt_idx" ON "StaffAccessToken"("userId", "purpose", "expiresAt");

-- AddForeignKey
ALTER TABLE "StaffAccessToken" ADD CONSTRAINT "StaffAccessToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
