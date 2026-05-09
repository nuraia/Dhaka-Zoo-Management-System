import { PrismaClient, Prisma } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting Zoo Management System Seeding...");

  // ====================== USERS ======================
  const users: Prisma.UserCreateInput[] = [
    {
      name: "Rajesh Sharma",
      phone: "9876543210",
      email: "admin@zoo.com",
      passwordHash: "$2b$10$dummyhashforadmin123", // In real project, use bcrypt
      role: "ADMIN",
    },
    {
      name: "Priya Patel",
      phone: "9876543211",
      email: "visitor@zoo.com",
      passwordHash: "$2b$10$dummyhashforvisitor123",
      role: "VISITOR",
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }
  console.log("✅ Users seeded");
}
  // ====================== AUTHORITIES ======================
//   const authorities = await Promise.all([
//     prisma.authority.create({
//       data: {
//         name: "Dr. Anil Verma",
//         email: "anil.verma@zoo.com",
//         phone: "9123456789",
  
//       },
//     }),
//     prisma.authority.create({
//       data: {
//         name: "Ms. Neha Kapoor",
//         email: "neha.kapoor@zoo.com",
//         phone: "9123456790",
        
//       },
//     }),
//   ]);
//   console.log("✅ Authorities seeded");

//   // ====================== ZONES ======================
//   const zones = await Promise.all([
//     prisma.zone.create({
//       data: { name: "Savanna Zone", habitatType: "Grassland", capacity: 25, MapCoords: "28.5355,77.3910", authority: { connect: { id: authorities[0].id } } },
//     }),
//     prisma.zone.create({
//       data: { name: "Aquatic Zone", habitatType: "Water", capacity: 20, MapCoords: "28.5360,77.3920", authority: { connect: { id: authorities[1].id } } },
//     }),
//     prisma.zone.create({
//       data: { name: "Aviary & Reptile Zone", habitatType: "Forest", capacity: 35, MapCoords: "28.5345,77.3905", authority: { connect: { id: authorities[1].id } } },
//     }),
//   ]);
//   console.log("✅ Zones seeded");

//   // ====================== CAREGIVERS ======================
//   const caregivers = await Promise.all([
//     prisma.caregiver.create({ data: { name: "Ramesh Kumar", email: "ramesh@zoo.com", phone: "9988776655", shift: "Morning", authorityId: authorities[0].id} }),
//     prisma.caregiver.create({ data: { name: "Sunita Devi", email: "sunita@zoo.com", phone: "9988776656", shift: "Evening",authorityId: authorities[0].id} }),
//     prisma.caregiver.create({ data: { name: "Vikas Malhotra", email: "vikas@zoo.com", phone: "9988776657", shift: "Morning", authorityId: authorities[1].id } }),
//     prisma.caregiver.create({ data: { name: "Meera Sharma", email: "meera@zoo.com", phone: "9988776658", shift: "Day", authorityId: authorities[1].id} }),
//   ]);
//   console.log("✅ Caregivers seeded");

//   // ====================== FOOD SUPPLIERS ======================
//   const suppliers = await Promise.all([
//     prisma.foodSupplier.create({
//       data: {
//         name: "FreshFeeds India",
//         email: "freshfeeds@gmail.com",
//         phone: "9112233445",
//         address: "Delhi Supply Hub",

//       },
//     }),
//     prisma.foodSupplier.create({
//       data: {
//         name: "GreenVeg Suppliers",
//         email: "greenveg@yahoo.com",
//         phone: "9112233446",
//         address: "Ghaziabad Farm",
//         // supplyItems removed as it is not defined in the schema
//       },
//     }),
//   ]);
//   console.log("✅ Food Suppliers seeded");

//   // ====================== ANIMALS ======================
//   const animals = await Promise.all([
//     prisma.animal.create({ data: { name: "Sheru", species: "Bengal Tiger", dob: "2018-05-12", gender: "MALE", healthStatus: "HEALTHY", imageURL: "https://example.com/tiger.jpg", zoneId: zones[0].id, caregiverId: caregivers[0].id } }),
//     prisma.animal.create({ data: { name: "Luna", species: "African Lion", dob: "2020-03-15", gender: "FEMALE", healthStatus: "HEALTHY", zoneId: zones[0].id, caregiverId: caregivers[1].id } }),
//     prisma.animal.create({ data: { name: "Ganga", species: "Indian Elephant", dob: "2010-11-20", gender: "FEMALE", healthStatus: "RECOVERING", zoneId: zones[0].id, caregiverId: caregivers[0].id } }),
//     prisma.animal.create({ data: { name: "Milo", species: "Bottlenose Dolphin", dob: "2017-08-10", gender: "MALE", healthStatus: "HEALTHY", zoneId: zones[1].id, caregiverId: caregivers[2].id } }),
//     prisma.animal.create({ data: { name: "Raja", species: "Saltwater Crocodile", dob: "2015-01-05", gender: "MALE", healthStatus: "HEALTHY", zoneId: zones[2].id, caregiverId: caregivers[3].id } }),
//     prisma.animal.create({ data: { name: "Kiara", species: "Indian Peacock", dob: "2022-04-18", gender: "FEMALE", healthStatus: "HEALTHY", zoneId: zones[2].id, caregiverId: caregivers[3].id } }),
//     prisma.animal.create({ data: { name: "Leo", species: "Snow Leopard", dob: "2019-06-30", gender: "MALE", healthStatus: "SICK", zoneId: zones[0].id, caregiverId: caregivers[1].id } }),
//     prisma.animal.create({ data: { name: "Tara", species: "Giant Tortoise", dob: "1980-02-14", gender: "FEMALE", healthStatus: "HEALTHY", zoneId: zones[2].id, caregiverId: caregivers[3].id } }),
//   ]);
//   console.log("✅ Animals seeded");

//   // ====================== FEEDING SCHEDULES ======================
//   await Promise.all([
//     prisma.feedingSchedule.create({ data: { foodItem: "Raw Chicken & Beef", quantity: "8 kg", feedTime: "08:30 AM", frequency: "Daily", animalId: animals[0].id, supplierId: suppliers[0].id } }),
//     prisma.feedingSchedule.create({ data: { foodItem: "Mutton & Supplements", quantity: "7 kg", feedTime: "09:00 AM", frequency: "Daily", animalId: animals[1].id, supplierId: suppliers[0].id } }),
//     prisma.feedingSchedule.create({ data: { foodItem: "Fish & Vitamins", quantity: "15 kg", feedTime: "10:30 AM", frequency: "Daily", animalId: animals[3].id, supplierId: suppliers[0].id } }),
//     prisma.feedingSchedule.create({ data: { foodItem: "Fruits & Hay", quantity: "25 kg", feedTime: "04:00 PM", frequency: "Daily", animalId: animals[2].id, supplierId: suppliers[1].id } }),
//     prisma.feedingSchedule.create({ data: { foodItem: "Fish & Shrimp", quantity: "12 kg", feedTime: "11:00 AM", frequency: "Daily", animalId: animals[4].id, supplierId: suppliers[0].id } }),
//   ]);
//   console.log("✅ Feeding Schedules seeded");

//   // ====================== TICKETS ======================
//   await Promise.all([
//     prisma.ticket.create({
//       data: { visitDate: new Date("2026-05-15"), type: "Adult", price: 500, status: "ACTIVE", userId: 1 },
//     }),
//     prisma.ticket.create({
//       data: { visitDate: new Date("2026-05-20"), type: "Student", price: 300, status: "ACTIVE", userId: 2 },
//     }),
//     prisma.ticket.create({
//       data: { visitDate: new Date("2026-05-10"), type: "Family", price: 1200, status: "USED", userId: 1 },
//     }),
//   ]);
//   console.log("✅ Tickets seeded");

//   console.log("🎉 Seeding Completed Successfully!");
// }

main()
  .catch((e) => {
    console.error("❌ Seeding Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });