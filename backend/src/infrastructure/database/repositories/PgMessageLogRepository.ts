import { IMessageLogRepository } from "../../../domain/repositories/IMessageLogRepository";
import { db } from "../connection";

export class PgMessageLogRepository implements IMessageLogRepository {
  async exists(chargeId: string, ruleType: string): Promise<boolean> {
    const row = await db("messages_log")
      .where({ charge_id: chargeId, rule_type: ruleType })
      .first();
    return !!row;
  }

  async create(chargeId: string, ruleType: string): Promise<void> {
    await db("messages_log").insert({ charge_id: chargeId, rule_type: ruleType });
  }
}
