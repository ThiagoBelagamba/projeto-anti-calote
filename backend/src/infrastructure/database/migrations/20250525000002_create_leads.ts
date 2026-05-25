import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("leads", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("name", 255).notNullable();
    table.string("email", 255).notNullable();
    table.string("whatsapp", 20).notNullable();
    table.string("gym_name", 255).nullable();
    table.string("customers_count", 50).nullable();
    table.text("challenge").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("leads");
}
