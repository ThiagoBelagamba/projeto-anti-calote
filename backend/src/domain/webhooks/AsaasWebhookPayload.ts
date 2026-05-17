export interface AsaasWebhookPayment {
  id: string;
  status?: string;
  customer?: string;
  customerId?: string;
  subscription?: string;
  externalReference?: string;
  value?: number;
  netValue?: number;
  paymentDate?: string;
  dueDate?: string;
}

export interface AsaasWebhookSubscription {
  id: string;
  customer?: string;
  externalReference?: string;
  status?: string;
  value?: number;
  nextDueDate?: string;
  cycle?: string;
}

export interface AsaasWebhookPayload {
  event: string;
  payment?: AsaasWebhookPayment;
  subscription?: AsaasWebhookSubscription;
}

export type AsaasPaymentType = "charge" | "subscription" | "unknown";
