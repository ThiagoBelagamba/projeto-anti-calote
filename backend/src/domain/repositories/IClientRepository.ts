import { Client } from "../entities/Client";

export interface CreateClientInput {
  user_id: string;
  name: string;
  whatsapp: string;
  document: string;
  asaas_customer_id?: string | null;
}

export interface IClientRepository {
  findAllByUserId(userId: string): Promise<Client[]>;
  findById(id: string): Promise<Client | null>;
  create(data: CreateClientInput): Promise<Client>;
  update(id: string, data: Partial<Pick<Client, "name" | "whatsapp" | "document">>): Promise<Client | null>;
  updateScore(id: string, score: number): Promise<void>;
  updateAsaasCustomerId(id: string, asaasCustomerId: string): Promise<void>;
}
