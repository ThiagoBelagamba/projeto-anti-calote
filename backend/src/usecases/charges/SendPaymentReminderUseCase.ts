import { IChargeRepository } from "../../domain/repositories/IChargeRepository";
import { IMessageLogRepository } from "../../domain/repositories/IMessageLogRepository";
import { AsaasClientService } from "../../infrastructure/services/AsaasClientService";
import { EvolutionApiService } from "../../infrastructure/services/EvolutionApiService";
import { buildPaymentReminderMessage } from "../../infrastructure/workers/messageTemplates";
import { AppError } from "../../shared/AppError";
import { resolvePaymentUrl } from "./resolvePaymentUrl";

export class SendPaymentReminderUseCase {
  constructor(
    private chargeRepo: IChargeRepository,
    private messageLogRepo: IMessageLogRepository,
    private asaasService: AsaasClientService,
    private evolutionService: EvolutionApiService
  ) {}

  async execute(chargeId: string): Promise<void> {
    const charge = await this.chargeRepo.findById(chargeId);
    if (!charge) throw new AppError("Cobrança não encontrada", 404);
    if (charge.status === "PAID") {
      throw new AppError("Cobrança já está paga", 400);
    }
    if (charge.status === "CANCELLED") {
      throw new AppError("Cobrança cancelada", 400);
    }
    if (!charge.client_whatsapp) {
      throw new AppError("Cliente sem WhatsApp", 400);
    }

    const paymentUrl = await resolvePaymentUrl(charge, this.chargeRepo, this.asaasService);
    const text = buildPaymentReminderMessage(charge, paymentUrl);

    await this.evolutionService.sendMessage(charge.client_whatsapp, text);
    await this.messageLogRepo.create(chargeId, "REMINDER");
  }
}
