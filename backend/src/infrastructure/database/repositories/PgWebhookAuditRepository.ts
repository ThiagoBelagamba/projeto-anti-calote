import {
  CreateWebhookAuditInput,
  IWebhookAuditRepository,
} from "../../../domain/repositories/IWebhookAuditRepository";
import { db } from "../connection";

export class PgWebhookAuditRepository implements IWebhookAuditRepository {
  async create(data: CreateWebhookAuditInput): Promise<void> {
    try {
      await db("webhooks_asaas").insert({
        event: data.event,
        payment_id: data.payment_id,
        payment_type: data.payment_type,
        payload_json: data.payload_json,
        status_processamento: data.status_processamento,
      });
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === "23505") {
        return;
      }
      throw err;
    }
  }
}
