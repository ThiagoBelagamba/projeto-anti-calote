import { Client } from "../../domain/entities/Client";
import { IClientRepository } from "../../domain/repositories/IClientRepository";
import { AsaasClientService } from "../../infrastructure/services/AsaasClientService";
import { formatWhatsappForEvolution } from "../../shared/formatWhatsapp";

export interface CreateClientDTO {
  name: string;
  whatsapp: string;
  document: string;
}

export class CreateClientUseCase {
  constructor(
    private clientRepo: IClientRepository,
    private asaasService: AsaasClientService,
    private userId: string
  ) {}

  async execute(dto: CreateClientDTO): Promise<Client> {
    const whatsapp = formatWhatsappForEvolution(dto.whatsapp);

    const asaasCustomerId = await this.asaasService.createCustomer({
      name: dto.name,
      cpfCnpj: dto.document,
      mobilePhone: whatsapp,
    });

    return this.clientRepo.create({
      user_id: this.userId,
      name: dto.name,
      whatsapp,
      document: dto.document,
      asaas_customer_id: asaasCustomerId,
    });
  }
}
