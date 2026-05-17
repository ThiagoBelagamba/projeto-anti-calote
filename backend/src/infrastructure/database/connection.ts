import knex, { Knex } from "knex";
import { env } from "../../config/env";

export const db: Knex = knex({
  client: "postgresql",
  connection: env.databaseUrl,
});
