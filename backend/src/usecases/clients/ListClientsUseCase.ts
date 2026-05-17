import { Client } from "../../domain/entities/Client";
import { IClientRepository } from "../../domain/repositories/IClientRepository";

export class ListClientsUseCase {
  constructor(
    private clientRepo: IClientRepository,
    private userId: string
  ) {}

  async execute(): Promise<Client[]> {
    return this.clientRepo.findAllByUserId(this.userId);
  }
}
