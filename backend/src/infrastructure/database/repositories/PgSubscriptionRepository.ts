import { Subscription, SubscriptionStatus } from "../../../domain/entities/Subscription";
import {
  CreateSubscriptionInput,
  ISubscriptionRepository,
} from "../../../domain/repositories/ISubscriptionRepository";
import { db } from "../connection";

export class PgSubscriptionRepository implements ISubscriptionRepository {
  async create(data: CreateSubscriptionInput): Promise<Subscription> {
    const [row] = await db("subscriptions")
      .insert({
        student_id: data.student_id,
        plan: data.plan,
        value: data.value,
        status: data.status || "PENDING",
        asaas_subscription_id: data.asaas_subscription_id ?? null,
        asaas_payment_id: data.asaas_payment_id ?? null,
      })
      .returning("*");
    return { ...row, value: parseFloat(String(row.value)) };
  }

  async findByAsaasPaymentId(asaasPaymentId: string): Promise<Subscription | null> {
    const row = await db("subscriptions").where({ asaas_payment_id: asaasPaymentId }).first();
    return row ? { ...row, value: parseFloat(String(row.value)) } : null;
  }

  async findByAsaasSubscriptionId(asaasSubscriptionId: string): Promise<Subscription | null> {
    const row = await db("subscriptions")
      .where({ asaas_subscription_id: asaasSubscriptionId })
      .first();
    return row ? { ...row, value: parseFloat(String(row.value)) } : null;
  }

  async findByStudentId(studentId: string): Promise<Subscription | null> {
    const row = await db("subscriptions")
      .where({ student_id: studentId })
      .orderBy("created_at", "desc")
      .first();
    return row ? { ...row, value: parseFloat(String(row.value)) } : null;
  }

  async hasBlockingSubscription(studentId: string): Promise<boolean> {
    const row = await db("subscriptions")
      .where({ student_id: studentId })
      .whereIn("status", ["PENDING", "ACTIVE", "OVERDUE"])
      .first();
    return !!row;
  }

  async updateStatus(
    id: string,
    status: SubscriptionStatus,
    activatedAt?: Date
  ): Promise<void> {
    const update: Record<string, unknown> = { status };
    if (activatedAt) update.activated_at = activatedAt;
    await db("subscriptions").where({ id }).update(update);
  }

  async updateAsaasPaymentId(id: string, asaasPaymentId: string): Promise<void> {
    await db("subscriptions").where({ id }).update({ asaas_payment_id: asaasPaymentId });
  }
}
