-- AlterTable
ALTER TABLE "ServiceRequest" ADD COLUMN "idempotencyKey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ServiceRequest_idempotencyKey_key" ON "ServiceRequest"("idempotencyKey");
