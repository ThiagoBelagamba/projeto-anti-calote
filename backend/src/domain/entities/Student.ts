export type StudentStatus = "PENDING" | "ACTIVE" | "CANCELLED";

export interface Student {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  document: string;
  whatsapp: string;
  asaas_customer_id: string | null;
  status: StudentStatus;
  created_at: Date;
}
