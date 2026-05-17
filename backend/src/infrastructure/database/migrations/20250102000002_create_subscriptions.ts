import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("subscriptions", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("student_id")
      .notNullable()
      .references("id")
      .inTable("students")
      .onDelete("CASCADE");
    table.enum("plan", ["monthly", "annual"], {
      useNative: true,
      enumName: "subscription_plan",
    }).notNullable();
    table.decimal("value", 12, 2).notNullable();
    table
      .enum("status", ["PENDING", "ACTIVE", "OVERDUE", "CANCELLED"], {
        useNative: true,
        enumName: "subscription_status",
      })
      .notNullable()
      .defaultTo("PENDING");
    table.string("asaas_subscription_id", 100).nullable();
    table.string("asaas_payment_id", 100).nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("activated_at").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("subscriptions");
  await knex.raw('DROP TYPE IF EXISTS "subscription_plan"');
  await knex.raw('DROP TYPE IF EXISTS "subscription_status"');
}
