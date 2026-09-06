import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { areasByZone, taskTypes, zones } from "./seedData";

const prisma = new PrismaClient();

async function clearData() {
  // Delete in FK-dependency order.
  await prisma.logEntry.deleteMany();
  await prisma.areaScoreOverride.deleteMany();
  await prisma.areaTask.deleteMany();
  await prisma.backlogItem.deleteMany();
  await prisma.area.deleteMany();
  await prisma.taskType.deleteMany();
  await prisma.zone.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
}

async function seedUsers() {
  const userPassword = await bcrypt.hash(process.env.USER_PASSWORD_USER || "password", 10);
  const adminPassword = await bcrypt.hash(process.env.USER_PASSWORD_ADMIN || "admin", 10);

  await prisma.user.createMany({
    data: [
      {
        name: "Example User",
        email: "user@example.com",
        emailVerified: new Date(),
        password: userPassword,
        role: "USER",
      },
      {
        name: "Admin User",
        email: "admin@example.com",
        emailVerified: new Date(),
        password: adminPassword,
        role: "ADMIN",
      },
    ],
  });
}

async function seedZonesAndAreas() {
  for (const zone of zones) {
    const created = await prisma.zone.create({ data: zone });
    const areaNames = areasByZone[zone.type] ?? [];
    if (areaNames.length > 0) {
      await prisma.area.createMany({
        data: areaNames.map((name) => ({ name, zoneId: created.id })),
      });
    }
  }
}

async function seedTaskTypes() {
  await prisma.taskType.createMany({ data: taskTypes });
}

async function main() {
  await clearData();
  await seedUsers();
  await seedZonesAndAreas();
  await seedTaskTypes();
  console.log("Seed complete: 2 users, 4 zones, sample areas and task types.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
