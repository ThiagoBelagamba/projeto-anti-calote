import { AsaasWebhookPayload } from "../../domain/webhooks/AsaasWebhookPayload";
import { Subscription } from "../../domain/entities/Subscription";
import { IStudentRepository } from "../../domain/repositories/IStudentRepository";
import { ISubscriptionRepository } from "../../domain/repositories/ISubscriptionRepository";

const PAID_EVENTS = ["PAYMENT_RECEIVED", "PAYMENT_CONFIRMED"];
const OVERDUE_EVENTS = ["PAYMENT_OVERDUE"];
const CANCEL_EVENTS = [
  "SUBSCRIPTION_DELETED",
  "SUBSCRIPTION_INACTIVATED",
  "PAYMENT_DELETED",
  "PAYMENT_REFUNDED",
  "PAYMENT_CHARGEBACK_REQUESTED",
];

export class ProcessSubscriptionWebhookUseCase {
  constructor(
    private subscriptionRepo: ISubscriptionRepository,
    private studentRepo: IStudentRepository
  ) {}

  async execute(payload: AsaasWebhookPayload): Promise<{ processed: boolean }> {
    if (CANCEL_EVENTS.includes(payload.event)) {
      return this.handleCancelled(payload);
    }

    if (OVERDUE_EVENTS.includes(payload.event)) {
      return this.handleOverdue(payload);
    }

    if (!PAID_EVENTS.includes(payload.event)) {
      return { processed: false };
    }

    const paymentId = payload.payment?.id;
    const subscriptionId =
      payload.payment?.subscription || payload.subscription?.id;

    if (!paymentId && !subscriptionId) {
      return { processed: false };
    }

    const subscription = await this.resolveSubscription(paymentId, subscriptionId);
    if (!subscription) return { processed: false };

    if (subscription.status === "ACTIVE") {
      if (paymentId && subscription.asaas_payment_id !== paymentId) {
        await this.subscriptionRepo.updateAsaasPaymentId(subscription.id, paymentId);
      }
      return { processed: true };
    }

    if (paymentId && subscription.asaas_payment_id !== paymentId) {
      await this.subscriptionRepo.updateAsaasPaymentId(subscription.id, paymentId);
    }

    await this.subscriptionRepo.updateStatus(subscription.id, "ACTIVE", new Date());
    await this.studentRepo.updateStatus(subscription.student_id, "ACTIVE");

    return { processed: true };
  }

  private async handleCancelled(
    payload: AsaasWebhookPayload
  ): Promise<{ processed: boolean }> {
    const paymentId = payload.payment?.id;
    const subscriptionId =
      payload.payment?.subscription || payload.subscription?.id;

    if (!paymentId && !subscriptionId) {
      return { processed: false };
    }

    const subscription = await this.resolveSubscription(paymentId, subscriptionId);
    if (!subscription) return { processed: false };

    if (subscription.status === "CANCELLED") return { processed: true };

    await this.subscriptionRepo.updateStatus(subscription.id, "CANCELLED");
    await this.studentRepo.updateStatus(subscription.student_id, "CANCELLED");

    return { processed: true };
  }

  private async handleOverdue(
    payload: AsaasWebhookPayload
  ): Promise<{ processed: boolean }> {
    const paymentId = payload.payment?.id;
    const subscriptionId =
      payload.payment?.subscription || payload.subscription?.id;

    const subscription = await this.resolveSubscription(paymentId, subscriptionId);
    if (!subscription) return { processed: false };

    if (subscription.status === "OVERDUE") return { processed: true };

    await this.subscriptionRepo.updateStatus(subscription.id, "OVERDUE");
    return { processed: true };
  }

  private async resolveSubscription(
    paymentId?: string,
    subscriptionId?: string
  ): Promise<Subscription | null> {
    if (paymentId) {
      const byPayment = await this.subscriptionRepo.findByAsaasPaymentId(paymentId);
      if (byPayment) return byPayment;
    }

    if (subscriptionId) {
      return this.subscriptionRepo.findByAsaasSubscriptionId(subscriptionId);
    }

    return null;
  }
}
