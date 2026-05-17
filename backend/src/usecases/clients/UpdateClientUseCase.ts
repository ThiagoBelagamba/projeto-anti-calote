import { Client } from "../../domain/entities/Client";
import { IClientRepository } from "../../domain/repositories/IClientRepository";
import { AppError } from "../../shared/AppError";

export class UpdateClientUseCase {
  constructor(private clientRepo: IClientRepository) {}

  async execute(
    id: string,
    data: Partial<Pick<Client, "name" | "whatsapp" | "document">>
  ): Promise<Client> {
    const updated = await this.clientRepo.update(id, data);
    if (!updated) throw new AppError("Cliente não encontrado", 404);
    return updated;
  }
}
