import { prisma } from "@/lib/prisma";

const LUANDA_MUNICIPALITIES = [
  "Cazenga",
  "Kilamba Kiaxi",
  "Maianga",
  "Rangel",
  "Sambizanga",
  "Samba",
  "Talatona",
  "Viana",
  "Prenda",
  "Cacuaco",
  "Belas",
  "Ingombota",
];

async function runSeedBaseData(): Promise<void> {
  console.log("[seed] Seeding base data...");

  const luandaProvince = await prisma.province.upsert({
    where: { name: "Luanda" },
    update: {},
    create: { name: "Luanda" },
  });

  for (const municipalityName of LUANDA_MUNICIPALITIES) {
    await prisma.municipality.upsert({
      where: {
        name_province_id: {
          name: municipalityName,
          province_id: luandaProvince.id,
        },
      },
      update: {},
      create: {
        name: municipalityName,
        province_id: luandaProvince.id,
      },
    });
  }

  console.log("[seed] Base data seeded successfully.");
}

runSeedBaseData()
  .catch((error) => {
    console.error("[seed] Failed to seed base data:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
