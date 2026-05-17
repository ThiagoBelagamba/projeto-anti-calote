import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("charges", (table) => {
    table.string("payment_url", 500).nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("charges", (table) => {
    table.dropColumn("payment_url");
  });
}
