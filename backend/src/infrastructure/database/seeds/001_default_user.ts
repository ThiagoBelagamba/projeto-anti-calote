import type { Knex } from "knex";

const DEFAULT_USER_ID = "00000000-0000-4000-8000-000000000001";

export async function seed(knex: Knex): Promise<void> {
  const exists = await knex("users").where({ id: DEFAULT_USER_ID }).first();
  if (!exists) {
    await knex("users").insert({
      id: DEFAULT_USER_ID,
      name: "Usuário Demo",
      email: "demo@anticallote.local",
      whatsapp: "5511999999999",
    });
  }
}

export { DEFAULT_USER_ID };
