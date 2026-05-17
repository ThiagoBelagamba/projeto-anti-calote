import { Client } from "../../domain/entities/Client";
import { IClientRepository } from "../../domain/repositories/IClientRepository";
import { AppError } from "../../shared/AppError";

export class GetClientUseCase {
  constructor(private clientRepo: IClientRepository) {}

  async execute(id: string): Promise<Client> {
    const client = await this.clientRepo.findById(id);
    if (!client) throw new AppError("Cliente não encontrado", 404);
    return client;
  }
}
