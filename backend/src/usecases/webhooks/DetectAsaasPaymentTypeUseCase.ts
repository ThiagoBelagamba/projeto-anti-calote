import { AsaasPaymentType, AsaasWebhookPayload } from "../../domain/webhooks/AsaasWebhookPayload";
import { IChargeRepository } from "../../domain/repositories/IChargeRepository";
import { ISubscriptionRepository } from "../../domain/repositories/ISubscriptionRepository";

export class DetectAsaasPaymentTypeUseCase {
  constructor(
    private chargeRepo: IChargeRepository,
    private subscriptionRepo: ISubscriptionRepository
  ) {}

  async execute(payload: AsaasWebhookPayload): Promise<AsaasPaymentType> {
    const subscriptionId =
      payload.payment?.subscription || payload.subscription?.id;

    if (subscriptionId) {
      return "subscription";
    }

    const paymentId = payload.payment?.id;
    if (!paymentId) {
      return "unknown";
    }

    const charge = await this.chargeRepo.findByAsaasPaymentId(paymentId);
    if (charge) {
      return "charge";
    }

    const subscription = await this.subscriptionRepo.findByAsaasPaymentId(paymentId);
    if (subscription) {
      return "subscription";
    }

    return "unknown";
  }
}
