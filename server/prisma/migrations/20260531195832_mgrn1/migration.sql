-- DropForeignKey
ALTER TABLE "Animal" DROP CONSTRAINT "Animal_caregiverId_fkey";

-- DropForeignKey
ALTER TABLE "FeedingSchedule" DROP CONSTRAINT "FeedingSchedule_supplierId_fkey";

-- AlterTable
ALTER TABLE "Animal" ALTER COLUMN "gender" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Caregiver_authority_id_idx" ON "Caregiver"("authority_id");

-- CreateIndex
CREATE INDEX "Caregiver_zone_id_idx" ON "Caregiver"("zone_id");

-- RenameForeignKey
ALTER TABLE "Animal" RENAME CONSTRAINT "Animal_zoneId_fkey" TO "Animal_zone_id_fkey";

-- RenameForeignKey
ALTER TABLE "Caregiver" RENAME CONSTRAINT "Caregiver_authorityId_fkey" TO "Caregiver_authority_id_fkey";

-- RenameForeignKey
ALTER TABLE "Caregiver" RENAME CONSTRAINT "Caregiver_zoneId_fkey" TO "Caregiver_zone_id_fkey";

-- RenameForeignKey
ALTER TABLE "FeedingSchedule" RENAME CONSTRAINT "FeedingSchedule_animalId_fkey" TO "FeedingSchedule_animal_id_fkey";

-- RenameForeignKey
ALTER TABLE "Ticket" RENAME CONSTRAINT "Ticket_userId_fkey" TO "Ticket_user_id_fkey";

-- AddForeignKey
ALTER TABLE "Animal" ADD CONSTRAINT "Animal_caregiver_id_fkey" FOREIGN KEY ("caregiver_id") REFERENCES "Caregiver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedingSchedule" ADD CONSTRAINT "FeedingSchedule_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "FoodSupplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
