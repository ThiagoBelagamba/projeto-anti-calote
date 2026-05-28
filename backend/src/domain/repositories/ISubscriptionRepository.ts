import { PlanType } from "../plans";
import { Subscription, SubscriptionStatus } from "../entities/Subscription";

export interface CreateSubscriptionInput {
  student_id: string;
  plan: PlanType;
  value: number;
  status?: SubscriptionStatus;
  asaas_subscription_id?: string | null;
  asaas_payment_id?: string | null;
}

export interface ISubscriptionRepository {
  create(data: CreateSubscriptionInput): Promise<Subscription>;
  findByAsaasPaymentId(asaasPaymentId: string): Promise<Subscription | null>;
  findByAsaasSubscriptionId(asaasSubscriptionId: string): Promise<Subscription | null>;
  findByStudentId(studentId: string): Promise<Subscription | null>;
  hasBlockingSubscription(studentId: string): Promise<boolean>;
  updateStatus(id: string, status: SubscriptionStatus, activatedAt?: Date): Promise<void>;
  updateAsaasPaymentId(id: string, asaasPaymentId: string): Promise<void>;
}
