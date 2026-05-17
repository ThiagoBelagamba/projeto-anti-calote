import { Request, Response } from "express";
import { AsaasWebhookPayload } from "../../../domain/webhooks/AsaasWebhookPayload";
import { IWebhookAuditRepository } from "../../../domain/repositories/IWebhookAuditRepository";
import { DetectAsaasPaymentTypeUseCase } from "../../../usecases/webhooks/DetectAsaasPaymentTypeUseCase";
import { DispatchAsaasWebhookUseCase } from "../../../usecases/webhooks/DispatchAsaasWebhookUseCase";

export class WebhookController {
  constructor(
    private detectPaymentType: DetectAsaasPaymentTypeUseCase,
    private dispatchWebhook: DispatchAsaasWebhookUseCase,
    private webhookAuditRepo: IWebhookAuditRepository
  ) {}

  asaas = (req: Request, res: Response): void => {
    const payload = req.body as AsaasWebhookPayload;
    const eventType = payload.event || "unknown";
    const paymentId =
      payload.payment?.id || `${eventType}_${Date.now()}`;

    void this.detectPaymentType
      .execute(payload)
      .then(async (paymentType) => {
        try {
          await this.webhookAuditRepo.create({
            event: eventType,
            payment_id: paymentId,
            payment_type: paymentType,
            payload_json: payload,
            status_processamento: "recebido",
          });
        } catch {
          // auditoria não bloqueia o fluxo
        }

        await this.dispatchWebhook.execute(eventType, paymentType, payload);
      })
      .catch((err) => {
        console.error("[WebhookController] async processing error:", err);
      });

    res.status(200).json({ received: true });
  };
}
