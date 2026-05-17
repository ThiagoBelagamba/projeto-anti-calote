import { AsaasPaymentType, AsaasWebhookPayload } from "../webhooks/AsaasWebhookPayload";

export interface CreateWebhookAuditInput {
  event: string;
  payment_id: string;
  payment_type: AsaasPaymentType | null;
  payload_json: AsaasWebhookPayload;
  status_processamento: string;
}

export interface IWebhookAuditRepository {
  create(data: CreateWebhookAuditInput): Promise<void>;
}
