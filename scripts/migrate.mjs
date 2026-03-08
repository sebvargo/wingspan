import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function migrate() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL environment variable is required");
    process.exit(1);
  }

  const sql = neon(databaseUrl);
  
  console.log("Running migrations...");
  
  const schema = readFileSync(join(__dirname, "001-create-tables.sql"), "utf-8");
  const statements = schema
    .split(/;\s*$/m)
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await sql(statement);
  }
  
  console.log("Migrations complete!");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
