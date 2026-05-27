import {
  AsaasPaymentType,
  AsaasWebhookPayload,
} from "../../domain/webhooks/AsaasWebhookPayload";
import { ProcessSubscriptionWebhookUseCase } from "./ProcessSubscriptionWebhookUseCase";
import { ProcessWebhookUseCase } from "./ProcessWebhookUseCase";

const PAID_EVENTS = ["PAYMENT_RECEIVED", "PAYMENT_CONFIRMED"];
const OVERDUE_EVENTS = ["PAYMENT_OVERDUE"];
const CANCEL_EVENTS = [
  "SUBSCRIPTION_DELETED",
  "SUBSCRIPTION_INACTIVATED",
  "PAYMENT_DELETED",
  "PAYMENT_REFUNDED",
  "PAYMENT_CHARGEBACK_REQUESTED",
];

export class DispatchAsaasWebhookUseCase {
  constructor(
    private processChargeWebhook: ProcessWebhookUseCase,
    private processSubscriptionWebhook: ProcessSubscriptionWebhookUseCase
  ) {}

  async execute(
    eventType: string,
    paymentType: AsaasPaymentType,
    payload: AsaasWebhookPayload
  ): Promise<void> {
    if (
      CANCEL_EVENTS.includes(eventType) ||
      PAID_EVENTS.includes(eventType) ||
      OVERDUE_EVENTS.includes(eventType)
    ) {
      if (paymentType === "subscription") {
        await this.processSubscriptionWebhook.execute(payload);
        return;
      }
      if (paymentType === "charge") {
        await this.processChargeWebhook.execute(payload);
        return;
      }
      return;
    }
  }
}
