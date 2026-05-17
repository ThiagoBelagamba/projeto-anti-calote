import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("messages_log", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("charge_id").notNullable().references("id").inTable("charges").onDelete("CASCADE");
    table.string("rule_type", 20).notNullable();
    table.timestamp("sent_at").defaultTo(knex.fn.now());
    table.unique(["charge_id", "rule_type"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("messages_log");
}
