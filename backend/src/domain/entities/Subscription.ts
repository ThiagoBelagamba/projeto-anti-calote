import { PlanType } from "../plans";

export type SubscriptionStatus = "PENDING" | "ACTIVE" | "OVERDUE" | "CANCELLED";

export interface Subscription {
  id: string;
  student_id: string;
  plan: PlanType;
  value: number;
  status: SubscriptionStatus;
  asaas_subscription_id: string | null;
  asaas_payment_id: string | null;
  created_at: Date;
  activated_at: Date | null;
}
