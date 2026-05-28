import type { Knex } from "knex";

/**
 * Antes de rodar em produção com dados existentes, verifique duplicatas:
 * SELECT document, COUNT(*) FROM students GROUP BY document HAVING COUNT(*) > 1;
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("students", (table) => {
    table.unique(["document"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("students", (table) => {
    table.dropUnique(["document"]);
  });
}
