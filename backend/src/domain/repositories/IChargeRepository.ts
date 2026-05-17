import { Charge, ChargeStatus, ChargeWithClient } from "../entities/Charge";

export interface CreateChargeInput {
  client_id: string;
  amount: number;
  description: string;
  due_date: string;
  status?: ChargeStatus;
  asaas_payment_id?: string | null;
  pix_payload?: string | null;
  payment_url?: string | null;
}

export interface IChargeRepository {
  findAll(filters?: {
    userId?: string;
    status?: ChargeStatus;
    clientId?: string;
  }): Promise<ChargeWithClient[]>;
  findById(id: string): Promise<ChargeWithClient | null>;
  findByAsaasPaymentId(asaasPaymentId: string): Promise<Charge | null>;
  create(data: CreateChargeInput): Promise<Charge>;
  updateStatus(id: string, status: ChargeStatus): Promise<void>;
  updatePaymentUrl(id: string, paymentUrl: string): Promise<void>;
  findForRegua(rule: string, referenceDate: string): Promise<ChargeWithClient[]>;
  markOverdue(referenceDate: string): Promise<number>;
}
