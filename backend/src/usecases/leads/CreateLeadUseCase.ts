import { db } from "../../infrastructure/database/connection";
import { Lead } from "../../domain/entities/Lead";

export interface CreateLeadDTO {
  name: string;
  email: string;
  whatsapp: string;
  gym_name?: string;
  customers_count?: string;
  challenge?: string;
}

export class CreateLeadUseCase {
  async execute(dto: CreateLeadDTO): Promise<Lead> {
    const [lead] = await db("leads")
      .insert({
        name: dto.name,
        email: dto.email.toLowerCase(),
        whatsapp: dto.whatsapp,
        gym_name: dto.gym_name,
        customers_count: dto.customers_count,
        challenge: dto.challenge,
      })
      .returning("*");

    return lead;
  }
}
