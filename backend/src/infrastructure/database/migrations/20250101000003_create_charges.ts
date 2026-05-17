import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("charges", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("client_id").notNullable().references("id").inTable("clients").onDelete("CASCADE");
    table.decimal("amount", 12, 2).notNullable();
    table.string("description", 500).notNullable();
    table.date("due_date").notNullable();
    table
      .enum("status", ["PENDING", "PAID", "OVERDUE", "CANCELLED"], {
        useNative: true,
        enumName: "charge_status",
      })
      .notNullable()
      .defaultTo("PENDING");
    table.string("asaas_payment_id", 100).nullable();
    table.text("pix_payload").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("charges");
  await knex.raw('DROP TYPE IF EXISTS "charge_status"');
}
