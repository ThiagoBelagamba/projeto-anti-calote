import { Client } from "../../../domain/entities/Client";
import {
  CreateClientInput,
  IClientRepository,
} from "../../../domain/repositories/IClientRepository";
import { db } from "../connection";

export class PgClientRepository implements IClientRepository {
  async findAllByUserId(userId: string): Promise<Client[]> {
    return db("clients").where({ user_id: userId }).orderBy("created_at", "desc");
  }

  async findById(id: string): Promise<Client | null> {
    const row = await db("clients").where({ id }).first();
    return row || null;
  }

  async create(data: CreateClientInput): Promise<Client> {
    const [row] = await db("clients")
      .insert({
        user_id: data.user_id,
        name: data.name,
        whatsapp: data.whatsapp,
        document: data.document,
        asaas_customer_id: data.asaas_customer_id ?? null,
      })
      .returning("*");
    return row;
  }

  async update(
    id: string,
    data: Partial<Pick<Client, "name" | "whatsapp" | "document">>
  ): Promise<Client | null> {
    const [row] = await db("clients").where({ id }).update(data).returning("*");
    return row || null;
  }

  async updateScore(id: string, score: number): Promise<void> {
    await db("clients").where({ id }).update({ score: Math.max(0, Math.min(100, score)) });
  }

  async updateAsaasCustomerId(id: string, asaasCustomerId: string): Promise<void> {
    await db("clients").where({ id }).update({ asaas_customer_id: asaasCustomerId });
  }
}
