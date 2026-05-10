import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import bcrypt from "bcryptjs";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
async function main() {
  // ====================== USERS ======================
  const salt = await bcrypt.genSalt(10);

  await prisma.user.upsert({
    where: { email: 'admin@zoo.com' },
    update: {},
    create: {
      name: 'Rajesh Sharma',
      phone: '9876543210',
      email: 'admin@zoo.com',
      passwordHash: await bcrypt.hash('admin123', salt),
      role: 'ADMIN',
    },
  });

  await prisma.user.upsert({
    where: { email: 'visitor@zoo.com' },
    update: {},
    create: {
      name: 'Priya Patel',
      phone: '9876543211',
      email: 'visitor@zoo.com',
      passwordHash: await bcrypt.hash('visitor123', salt),
      role: 'VISITOR',
    },
  });

  console.log('✅ Users seeded');

  // ====================== AUTHORITIES ======================
  const authorities = await Promise.all([
    prisma.authority.create({
      data: { name: "Dr. Anil Verma", email: "anil.verma@zoo.com", phone: "9123456789", position: "Chief Wildlife Officer" }
    }),
    prisma.authority.create({
      data: { name: "Ms. Neha Kapoor", email: "neha.kapoor@zoo.com", phone: "9123456790", position: "Conservation Director" }
    }),
  ]);

  console.log('✅ Authorities seeded');

  // ====================== ZONES ======================
  const zones = await Promise.all([
    prisma.zone.create({
      data: { name: "Savanna Zone", habitatType: "Grassland", capacity: 25, status: "ACTIVE", MapCoords: "28.5355,77.3910" }
    }),
    prisma.zone.create({
      data: { name: "Aquatic Zone", habitatType: "Water", capacity: 20, status: "ACTIVE", MapCoords: "28.5360,77.3920" }
    }),
    prisma.zone.create({
      data: { name: "Aviary & Reptile Zone", habitatType: "Forest", capacity: 35, status: "ACTIVE", MapCoords: "28.5345,77.3905" }
    }),
  ]);

  console.log('✅ Zones seeded');
  
   // ====================== CAREGIVERS ======================
   const caregivers = await Promise.all([
    prisma.caregiver.create({
      data: {
        name: "Ramesh Kumar",
        email: "ramesh.care@zoo.com",
        phone: "9988776655",
        shift: "Morning",
        experience: 8,
        authorityId: authorities[0].id,
        zoneId: zones[0].id,
      }
    }),
    prisma.caregiver.create({
      data: {
        name: "Sunita Devi",
        email: "sunita.care@zoo.com",
        phone: "9988776656",
        shift: "Evening",
        experience: 6,
        authorityId: authorities[0].id,
        zoneId: zones[0].id,
      }
    }),
    prisma.caregiver.create({
      data: {
        name: "Vikas Malhotra",
        email: "vikas.care@zoo.com",
        phone: "9988776657",
        shift: "Morning",
        experience: 12,
        authorityId: authorities[1].id,
        zoneId: zones[1].id,
      }
    }),
    prisma.caregiver.create({
      data: {
        name: "Meera Sharma",
        email: "meera.care@zoo.com",
        phone: "9988776658",
        shift: "Day",
        experience: 5,
        authorityId: authorities[1].id,
        zoneId: zones[2].id,
      }
    }),
  ]);

  console.log('✅ Caregivers seeded');

 // ====================== FOOD SUPPLIERS ======================
 const suppliers = await Promise.all([
    prisma.foodSupplier.create({
      data: {
        name: "FreshFeeds India",
        email: "freshfeeds@gmail.com",
        phone: "9112233445",
        address: "Delhi Supply Hub",
        supplyItems: ["Meat", "Fish", "Chicken", "Eggs"],
      }
    }),
    prisma.foodSupplier.create({
      data: {
        name: "GreenVeg Suppliers",
        email: "greenveg@yahoo.com",
        phone: "9112233446",
        address: "Ghaziabad Farm",
        supplyItems: ["Fruits", "Vegetables", "Hay", "Bamboo"],
      }
    }),
  ]);

  console.log('✅ Food Suppliers seeded');
  // ====================== ANIMALS ======================
  const animals = await Promise.all([
    prisma.animal.create({
      data: { name: "Sheru", species: "Bengal Tiger", dob: "2018-05-12", gender: "MALE", healthStatus: "HEALTHY", imageURL: "https://example.com/tiger.jpg", zoneId: zones[0].id, caregiverId: caregivers[0].id }
    }),
    prisma.animal.create({
      data: { name: "Luna", species: "African Lion", dob: "2020-03-15", gender: "FEMALE", healthStatus: "HEALTHY", zoneId: zones[0].id, caregiverId: caregivers[1].id }
    }),
    prisma.animal.create({
      data: { name: "Ganga", species: "Indian Elephant", dob: "2010-11-20", gender: "FEMALE", healthStatus: "RECOVERING", zoneId: zones[0].id, caregiverId: caregivers[0].id }
    }),
    prisma.animal.create({
      data: { name: "Milo", species: "Bottlenose Dolphin", dob: "2017-08-10", gender: "MALE", healthStatus: "HEALTHY", zoneId: zones[1].id, caregiverId: caregivers[2].id }
    }),
    prisma.animal.create({
      data: { name: "Raja", species: "Saltwater Crocodile", dob: "2015-01-05", gender: "MALE", healthStatus: "HEALTHY", zoneId: zones[2].id, caregiverId: caregivers[3].id }
    }),
    prisma.animal.create({
      data: { name: "Kiara", species: "Indian Peacock", dob: "2022-04-18", gender: "FEMALE", healthStatus: "HEALTHY", zoneId: zones[2].id, caregiverId: caregivers[3].id }
    }),
    prisma.animal.create({
      data: { name: "Leo", species: "Snow Leopard", dob: "2019-06-30", gender: "MALE", healthStatus: "SICK", zoneId: zones[0].id, caregiverId: caregivers[1].id }
    }),
    prisma.animal.create({
      data: { name: "Tara", species: "Giant Tortoise", dob: "1980-02-14", gender: "FEMALE", healthStatus: "HEALTHY", zoneId: zones[2].id, caregiverId: caregivers[3].id }
    }),
  ]);

  console.log('✅ Animals seeded');

// ====================== FEEDING SCHEDULES ======================
await Promise.all([
    prisma.feedingSchedule.create({
      data: {
        foodItem: "Raw Chicken & Beef",
        quantity: "8 kg",
        feedTime: "08:30 AM",
        frequency: "Daily",
        animalId: animals[0].id,
        supplierId: suppliers[0].id,
      }
    }),
    prisma.feedingSchedule.create({
      data: {
        foodItem: "Mutton & Supplements",
        quantity: "7 kg",
        feedTime: "09:00 AM",
        frequency: "Daily",
        animalId: animals[1].id,
        supplierId: suppliers[0].id,
      }
    }),
    prisma.feedingSchedule.create({
      data: {
        foodItem: "Fish & Vitamins",
        quantity: "15 kg",
        feedTime: "10:30 AM",
        frequency: "Daily",
        animalId: animals[3].id,
        supplierId: suppliers[0].id,
      }
    }),
    prisma.feedingSchedule.create({
      data: {
        foodItem: "Fruits & Hay",
        quantity: "25 kg",
        feedTime: "04:00 PM",
        frequency: "Daily",
        animalId: animals[2].id,
        supplierId: suppliers[1].id,
      }
    }),
  ]);
  console.log('✅ Feeding Schedules seeded');

  console.log('🎉 All data seeded successfully!');
}
main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });