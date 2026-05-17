import type { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });
dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "postgresql",
    connection:
      process.env.DATABASE_URL ||
      "postgresql://postgres:postgres_senha_local@localhost:5432/anti_calote_db",
    migrations: {
      directory: "./src/infrastructure/database/migrations",
      extension: "ts",
    },
    seeds: {
      directory: "./src/infrastructure/database/seeds",
      extension: "ts",
    },
  },
};

export default config;
