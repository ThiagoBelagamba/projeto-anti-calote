import axios from "axios";

const checkoutApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api",
  headers: { "Content-Type": "application/json" },
});

export type PlanType = "monthly" | "annual";

export interface CheckoutPayload {
  email: string;
  password: string;
  document: string;
  name: string;
  whatsapp: string;
  plan: PlanType;
  credit_card: {
    holderName: string;
    number: string;
    expiryMonth: string;
    expiryYear: string;
    ccv: string;
  };
  credit_card_holder_info: {
    name: string;
    email: string;
    cpfCnpj: string;
    postalCode: string;
    addressNumber: string;
    phone: string;
  };
}

export interface CheckoutResponse {
  success: boolean;
  subscription_id?: string;
  student_id?: string;
  asaas_payment_id?: string | null;
  asaas_subscription_id?: string;
  invoice_url?: string;
  status?: string;
  message?: string;
}

export interface PlansResponse {
  monthly: { label: string; value: number; monthlyEquivalent: number };
  annual: { label: string; value: number; monthlyEquivalent: number; savings: number };
}

export async function getPlans() {
  const { data } = await checkoutApi.get<PlansResponse>("/checkout/plans");
  return data;
}

export async function registerAndSubscribe(payload: CheckoutPayload) {
  const { data } = await checkoutApi.post<CheckoutResponse>(
    "/checkout/register-and-subscribe",
    payload
  );
  return data;
}

export async function getPaymentStatus(asaasPaymentId: string) {
  const { data } = await checkoutApi.get<{ confirmed: boolean; status: string }>(
    "/checkout/payment-status",
    { params: { asaas_payment_id: asaasPaymentId } }
  );
  return data;
}
