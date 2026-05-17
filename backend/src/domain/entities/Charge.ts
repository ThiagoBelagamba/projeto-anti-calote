export type ChargeStatus = "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";

export interface Charge {
  id: string;
  client_id: string;
  amount: number;
  description: string;
  due_date: Date | string;
  status: ChargeStatus;
  asaas_payment_id: string | null;
  pix_payload: string | null;
  payment_url: string | null;
  created_at: Date;
}

export interface ChargeWithClient extends Charge {
  client_name?: string;
  client_whatsapp?: string;
  client_document?: string;
}
