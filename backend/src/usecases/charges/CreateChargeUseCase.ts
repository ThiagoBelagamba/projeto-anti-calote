import { Charge } from "../../domain/entities/Charge";
import { IChargeRepository } from "../../domain/repositories/IChargeRepository";
import { IClientRepository } from "../../domain/repositories/IClientRepository";
import { AsaasClientService } from "../../infrastructure/services/AsaasClientService";
import { AppError } from "../../shared/AppError";

export interface CreateChargeDTO {
  client_id: string;
  amount: number;
  description: string;
  due_date: string;
}

export class CreateChargeUseCase {
  constructor(
    private chargeRepo: IChargeRepository,
    private clientRepo: IClientRepository,
    private asaasService: AsaasClientService
  ) {}

  async execute(dto: CreateChargeDTO): Promise<Charge> {
    const client = await this.clientRepo.findById(dto.client_id);
    if (!client) throw new AppError("Cliente não encontrado", 404);
    if (!client.asaas_customer_id) {
      throw new AppError("Cliente sem cadastro no Asaas", 400);
    }

    const { paymentId, pixPayload, paymentUrl } = await this.asaasService.createPixCharge({
      customerId: client.asaas_customer_id,
      value: dto.amount,
      dueDate: dto.due_date,
      description: dto.description,
    });

    return this.chargeRepo.create({
      client_id: dto.client_id,
      amount: dto.amount,
      description: dto.description,
      due_date: dto.due_date,
      asaas_payment_id: paymentId,
      pix_payload: pixPayload,
      payment_url: paymentUrl,
      status: "PENDING",
    });
  }
}
