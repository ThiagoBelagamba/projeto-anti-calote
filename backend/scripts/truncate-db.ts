import dotenv from "dotenv";
import path from "path";
import { Client } from "pg";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config();

const TABLES = [
  "messages_log",
  "subscriptions",
  "charges",
  "clients",
  "students",
  "webhooks_asaas",
  "leads",
  "users",
];

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  await client.query(
    `TRUNCATE TABLE ${TABLES.join(", ")} RESTART IDENTITY CASCADE`
  );

  for (const table of TABLES) {
    const { rows } = await client.query<{ n: number }>(
      `SELECT COUNT(*)::int AS n FROM ${table}`
    );
    console.log(`${table}: ${rows[0].n} registros`);
  }

  await client.end();
  console.log("\nBanco truncado com sucesso.");
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
