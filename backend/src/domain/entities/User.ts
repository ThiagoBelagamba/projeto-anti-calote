export interface User {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  password_hash?: string | null;
  created_at: Date;
}
