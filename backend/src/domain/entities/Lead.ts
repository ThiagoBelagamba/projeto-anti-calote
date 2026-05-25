export interface Lead {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  gym_name?: string | null;
  customers_count?: string | null;
  challenge?: string | null;
  created_at: Date;
}
