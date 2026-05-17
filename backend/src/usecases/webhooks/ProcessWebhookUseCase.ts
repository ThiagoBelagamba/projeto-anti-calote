import { AsaasWebhookPayload } from "../../domain/webhooks/AsaasWebhookPayload";
import { IChargeRepository } from "../../domain/repositories/IChargeRepository";
import { IClientRepository } from "../../domain/repositories/IClientRepository";
import { IMessageLogRepository } from "../../domain/repositories/IMessageLogRepository";
import { EvolutionApiService } from "../../infrastructure/services/EvolutionApiService";
import { buildPaidMessage } from "../../infrastructure/workers/messageTemplates";

const PAID_EVENTS = ["PAYMENT_RECEIVED", "PAYMENT_CONFIRMED"];
const OVERDUE_EVENTS = ["PAYMENT_OVERDUE"];

export class ProcessWebhookUseCase {
  constructor(
    private chargeRepo: IChargeRepository,
    private clientRepo: IClientRepository,
    private messageLogRepo: IMessageLogRepository,
    private evolutionService: EvolutionApiService
  ) {}

  async execute(payload: AsaasWebhookPayload): Promise<{ processed: boolean }> {
    if (OVERDUE_EVENTS.includes(payload.event)) {
      return this.handleOverdue(payload);
    }

    if (!PAID_EVENTS.includes(payload.event)) {
      return { processed: false };
    }

    const paymentId = payload.payment?.id;
    if (!paymentId) return { processed: false };

    const charge = await this.chargeRepo.findByAsaasPaymentId(paymentId);
    if (!charge) return { processed: false };
    if (charge.status === "PAID") return { processed: true };

    await this.chargeRepo.updateStatus(charge.id, "PAID");

    const client = await this.clientRepo.findById(charge.client_id);
    if (client) {
      const newScore = Math.min(100, client.score + 10);
      await this.clientRepo.updateScore(client.id, newScore);

      const alreadySent = await this.messageLogRepo.exists(charge.id, "PAID");
      if (!alreadySent && client.whatsapp) {
        const text = buildPaidMessage(client.name, charge.amount);
        await this.evolutionService.sendMessage(client.whatsapp, text);
        await this.messageLogRepo.create(charge.id, "PAID");
      }
    }

    return { processed: true };
  }

  private async handleOverdue(
    payload: AsaasWebhookPayload
  ): Promise<{ processed: boolean }> {
    const paymentId = payload.payment?.id;
    if (!paymentId) return { processed: false };

    const charge = await this.chargeRepo.findByAsaasPaymentId(paymentId);
    if (!charge) return { processed: false };
    if (charge.status === "OVERDUE" || charge.status === "PAID") {
      return { processed: true };
    }

    await this.chargeRepo.updateStatus(charge.id, "OVERDUE");
    return { processed: true };
  }
}
