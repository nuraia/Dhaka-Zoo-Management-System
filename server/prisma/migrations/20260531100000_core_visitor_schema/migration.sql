-- Expand the starter schema into a normalized visitor-focused zoo model.
-- This migration keeps the existing PostgreSQL provider and preserves legacy
-- entities such as Authority, Caregiver, and FoodSupplier.

CREATE TYPE "DietType" AS ENUM ('HERBIVORE', 'CARNIVORE', 'OMNIVORE');
CREATE TYPE "FoodCategory" AS ENUM ('MEAT', 'FISH', 'PRODUCE', 'GRAIN', 'HAY', 'SUPPLEMENT', 'OTHER');
CREATE TYPE "TicketType" AS ENUM ('ADULT', 'CHILD', 'FAMILY');

ALTER TABLE "User" RENAME COLUMN "passwordHash" TO "password_hash";
ALTER TABLE "User" RENAME COLUMN "createdAt" TO "created_at";

ALTER TABLE "Authority" RENAME COLUMN "createdAt" TO "created_at";

ALTER TABLE "Zone" RENAME COLUMN "MapCoords" TO "map_coords";
ALTER TABLE "Zone" ADD COLUMN "description" TEXT NOT NULL DEFAULT '';

ALTER TABLE "Caregiver" RENAME COLUMN "authorityId" TO "authority_id";
ALTER TABLE "Caregiver" RENAME COLUMN "zoneId" TO "zone_id";

CREATE TABLE "Species" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "diet_type" "DietType" NOT NULL,
    "habitat" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    CONSTRAINT "Species_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Species_name_key" ON "Species"("name");
CREATE INDEX "Species_name_idx" ON "Species"("name");

INSERT INTO "Species" ("name", "diet_type", "habitat", "description")
SELECT DISTINCT
    "species",
    'OMNIVORE'::"DietType",
    'Mixed habitat',
    'Imported from the original animal species text during normalization.'
FROM "Animal";

ALTER TABLE "Animal" ADD COLUMN "species_id" INTEGER;
UPDATE "Animal"
SET "species_id" = "Species"."id"
FROM "Species"
WHERE "Animal"."species" = "Species"."name";
ALTER TABLE "Animal" ALTER COLUMN "species_id" SET NOT NULL;
ALTER TABLE "Animal" DROP COLUMN "species";
ALTER TABLE "Animal" RENAME COLUMN "zoneId" TO "zone_id";
ALTER TABLE "Animal" RENAME COLUMN "caregiverId" TO "caregiver_id";
ALTER TABLE "Animal" RENAME COLUMN "healthStatus" TO "health_status";
ALTER TABLE "Animal" RENAME COLUMN "imageURL" TO "image_url";
ALTER TABLE "Animal" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "Animal" ADD COLUMN "last_fed_at" TIMESTAMP(3);
ALTER TABLE "Animal" ALTER COLUMN "dob" TYPE TIMESTAMP(3) USING "dob"::timestamp;
ALTER TABLE "Animal" ALTER COLUMN "caregiver_id" DROP NOT NULL;

ALTER TABLE "Animal" ADD CONSTRAINT "Animal_species_id_fkey" FOREIGN KEY ("species_id") REFERENCES "Species"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE INDEX "Animal_name_idx" ON "Animal"("name");
CREATE INDEX "Animal_species_id_idx" ON "Animal"("species_id");
CREATE INDEX "Animal_zone_id_idx" ON "Animal"("zone_id");
CREATE INDEX "Animal_caregiver_id_idx" ON "Animal"("caregiver_id");

CREATE TABLE "FoodItem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" "FoodCategory" NOT NULL,
    "unit" TEXT NOT NULL,
    CONSTRAINT "FoodItem_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "FoodItem_name_key" ON "FoodItem"("name");

INSERT INTO "FoodItem" ("name", "category", "unit")
SELECT DISTINCT "foodItem", 'OTHER'::"FoodCategory", 'kg'
FROM "FeedingSchedule";

ALTER TABLE "FeedingSchedule" ADD COLUMN "food_item_id" INTEGER;
UPDATE "FeedingSchedule"
SET "food_item_id" = "FoodItem"."id"
FROM "FoodItem"
WHERE "FeedingSchedule"."foodItem" = "FoodItem"."name";
ALTER TABLE "FeedingSchedule" ALTER COLUMN "food_item_id" SET NOT NULL;
ALTER TABLE "FeedingSchedule" DROP COLUMN "foodItem";
ALTER TABLE "FeedingSchedule" RENAME COLUMN "animalId" TO "animal_id";
ALTER TABLE "FeedingSchedule" RENAME COLUMN "supplierId" TO "supplier_id";
ALTER TABLE "FeedingSchedule" RENAME COLUMN "feedTime" TO "time";
ALTER TABLE "FeedingSchedule" ALTER COLUMN "supplier_id" DROP NOT NULL;
ALTER TABLE "FeedingSchedule" ADD CONSTRAINT "FeedingSchedule_food_item_id_fkey" FOREIGN KEY ("food_item_id") REFERENCES "FoodItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE INDEX "FeedingSchedule_animal_id_idx" ON "FeedingSchedule"("animal_id");
CREATE INDEX "FeedingSchedule_food_item_id_idx" ON "FeedingSchedule"("food_item_id");

ALTER TABLE "Ticket" RENAME COLUMN "visitDate" TO "visit_date";
ALTER TABLE "Ticket" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "Ticket" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "Ticket" ADD COLUMN "qr_code" TEXT;
UPDATE "Ticket"
SET "qr_code" = concat('DZ-', "id", '-', substring(md5(random()::text) for 8))
WHERE "qr_code" IS NULL;
ALTER TABLE "Ticket" ALTER COLUMN "qr_code" SET NOT NULL;
ALTER TABLE "Ticket" ALTER COLUMN "type" TYPE "TicketType"
USING (
    CASE
        WHEN upper("type") IN ('ADULT', 'CHILD', 'FAMILY') THEN upper("type")
        ELSE 'ADULT'
    END
)::"TicketType";
ALTER TABLE "Ticket" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
CREATE UNIQUE INDEX "Ticket_qr_code_key" ON "Ticket"("qr_code");
CREATE INDEX "Ticket_visit_date_idx" ON "Ticket"("visit_date");
CREATE INDEX "Ticket_user_id_idx" ON "Ticket"("user_id");

CREATE TABLE "HealthRecord" (
    "id" SERIAL NOT NULL,
    "animal_id" INTEGER NOT NULL,
    "status" "HealthStatus" NOT NULL,
    "notes" TEXT NOT NULL,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "HealthRecord_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "FeedingLog" (
    "id" SERIAL NOT NULL,
    "feeding_schedule_id" INTEGER NOT NULL,
    "animal_id" INTEGER NOT NULL,
    "fed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quantity" TEXT NOT NULL,
    "marked_by_user_id" INTEGER,
    CONSTRAINT "FeedingLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TicketZone" (
    "id" SERIAL NOT NULL,
    "ticket_id" INTEGER NOT NULL,
    "zone_id" INTEGER NOT NULL,
    CONSTRAINT "TicketZone_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DayPlan" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DayPlan_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DayPlanZone" (
    "id" SERIAL NOT NULL,
    "day_plan_id" INTEGER NOT NULL,
    "zone_id" INTEGER NOT NULL,
    "visit_order" INTEGER NOT NULL,
    CONSTRAINT "DayPlanZone_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "action" TEXT NOT NULL,
    "table_name" TEXT NOT NULL,
    "record_id" TEXT NOT NULL,
    "old_value" JSONB,
    "new_value" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "HealthRecord" ADD CONSTRAINT "HealthRecord_animal_id_fkey" FOREIGN KEY ("animal_id") REFERENCES "Animal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "FeedingLog" ADD CONSTRAINT "FeedingLog_feeding_schedule_id_fkey" FOREIGN KEY ("feeding_schedule_id") REFERENCES "FeedingSchedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "FeedingLog" ADD CONSTRAINT "FeedingLog_animal_id_fkey" FOREIGN KEY ("animal_id") REFERENCES "Animal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "FeedingLog" ADD CONSTRAINT "FeedingLog_marked_by_user_id_fkey" FOREIGN KEY ("marked_by_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TicketZone" ADD CONSTRAINT "TicketZone_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TicketZone" ADD CONSTRAINT "TicketZone_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "Zone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "DayPlan" ADD CONSTRAINT "DayPlan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "DayPlanZone" ADD CONSTRAINT "DayPlanZone_day_plan_id_fkey" FOREIGN KEY ("day_plan_id") REFERENCES "DayPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DayPlanZone" ADD CONSTRAINT "DayPlanZone_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "Zone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "HealthRecord_animal_id_idx" ON "HealthRecord"("animal_id");
CREATE INDEX "HealthRecord_recorded_at_idx" ON "HealthRecord"("recorded_at");
CREATE INDEX "FeedingLog_feeding_schedule_id_idx" ON "FeedingLog"("feeding_schedule_id");
CREATE INDEX "FeedingLog_animal_id_idx" ON "FeedingLog"("animal_id");
CREATE INDEX "FeedingLog_fed_at_idx" ON "FeedingLog"("fed_at");
CREATE UNIQUE INDEX "TicketZone_ticket_id_zone_id_key" ON "TicketZone"("ticket_id", "zone_id");
CREATE INDEX "TicketZone_zone_id_idx" ON "TicketZone"("zone_id");
CREATE UNIQUE INDEX "DayPlan_user_id_date_key" ON "DayPlan"("user_id", "date");
CREATE INDEX "DayPlan_date_idx" ON "DayPlan"("date");
CREATE UNIQUE INDEX "DayPlanZone_day_plan_id_zone_id_key" ON "DayPlanZone"("day_plan_id", "zone_id");
CREATE INDEX "DayPlanZone_visit_order_idx" ON "DayPlanZone"("visit_order");
CREATE INDEX "AuditLog_table_name_record_id_idx" ON "AuditLog"("table_name", "record_id");
CREATE INDEX "AuditLog_created_at_idx" ON "AuditLog"("created_at");
