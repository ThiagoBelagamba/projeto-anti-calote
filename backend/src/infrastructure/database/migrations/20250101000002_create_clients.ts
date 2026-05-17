import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("clients", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.string("name", 255).notNullable();
    table.string("whatsapp", 20).notNullable();
    table.string("document", 20).notNullable();
    table.integer("score").notNullable().defaultTo(100);
    table.string("asaas_customer_id", 100).nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("clients");
}
