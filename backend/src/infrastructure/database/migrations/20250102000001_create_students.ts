import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("students", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("name", 255).notNullable();
    table.string("email", 255).notNullable().unique();
    table.string("password_hash", 255).notNullable();
    table.string("document", 20).notNullable();
    table.string("whatsapp", 20).notNullable();
    table.string("asaas_customer_id", 100).nullable();
    table
      .enum("status", ["PENDING", "ACTIVE", "CANCELLED"], {
        useNative: true,
        enumName: "student_status",
      })
      .notNullable()
      .defaultTo("PENDING");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("students");
  await knex.raw('DROP TYPE IF EXISTS "student_status"');
}
