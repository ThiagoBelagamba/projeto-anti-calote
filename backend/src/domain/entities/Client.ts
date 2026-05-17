export interface Client {
  id: string;
  user_id: string;
  name: string;
  whatsapp: string;
  document: string;
  score: number;
  asaas_customer_id: string | null;
  created_at: Date;
}
