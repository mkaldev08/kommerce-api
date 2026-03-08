import { randomUUID } from "node:crypto";
import { DatabaseSync } from "node:sqlite";

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

function resolveDatabasePath(databaseUrl: string): string {
  if (!databaseUrl.startsWith("file:")) {
    throw new Error(`[seed] Unsupported DATABASE_URL: ${databaseUrl}`);
  }

  const rawPath = databaseUrl.slice(5);

  if (process.platform === "win32") {
    return rawPath.replace(/^\/(\w:\/)/, "$1");
  }

  return rawPath;
}

async function runSeedBaseData(): Promise<void> {
  const cliDatabaseArg = process.argv[2];
  const databaseUrl =
    process.env.DATABASE_URL ?? process.env.database_url ?? cliDatabaseArg;

  if (!databaseUrl) {
    throw new Error(
      "[seed] DATABASE_URL is not defined. Set DATABASE_URL=file:/absolute/path/to/kommerce.db or pass it as first argument.",
    );
  }

  const databasePath = resolveDatabasePath(databaseUrl);
  const db = new DatabaseSync(databasePath);

  console.log("[seed] Seeding base data...");

  const existingProvince = db
    .prepare(`SELECT id FROM "Province" WHERE name = ? LIMIT 1`)
    .get("Luanda") as { id: string } | undefined;

  const provinceId = existingProvince?.id ?? randomUUID();

  if (!existingProvince) {
    db.prepare(
      `INSERT INTO "Province" (id, name, created_at, updated_at)
       VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    ).run(provinceId, "Luanda");
  }

  for (const municipalityName of LUANDA_MUNICIPALITIES) {
    const exists = db
      .prepare(
        `SELECT id
         FROM "Municipality"
         WHERE name = ? AND province_id = ?
         LIMIT 1`,
      )
      .get(municipalityName, provinceId);

    if (!exists) {
      db.prepare(
        `INSERT INTO "Municipality" (id, name, province_id, created_at, updated_at)
         VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      ).run(randomUUID(), municipalityName, provinceId);
    }
  }

  db.close();

  console.log("[seed] Base data seeded successfully.");
}

runSeedBaseData().catch((error) => {
  console.error("[seed] Failed to seed base data:", error);
  process.exit(1);
});
