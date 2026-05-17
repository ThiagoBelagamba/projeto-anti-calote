import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("webhooks_asaas", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("event", 80).notNullable();
    table.string("payment_id", 120).notNullable();
    table.string("payment_type", 20).nullable();
    table.jsonb("payload_json").notNullable();
    table.string("status_processamento", 40).notNullable().defaultTo("recebido");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.unique(["event", "payment_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("webhooks_asaas");
}
