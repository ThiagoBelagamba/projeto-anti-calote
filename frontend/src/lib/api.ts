import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("@AntiCalote:token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export interface Client {
  id: string;
  name: string;
  whatsapp: string;
  document: string;
  score: number;
  asaas_customer_id: string | null;
  created_at: string;
}

export interface Charge {
  id: string;
  client_id: string;
  amount: number;
  description: string;
  due_date: string;
  status: "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";
  asaas_payment_id: string | null;
  pix_payload: string | null;
  payment_url: string | null;
  client_name?: string;
  client_whatsapp?: string;
  client_document?: string;
}

export interface DashboardStudentRow {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  document: string;
  status: string;
  plan: string | null;
  plan_label: string;
  subscription_status: string | null;
  subscription_value: number | null;
  created_at: string;
}

export interface DashboardSummary {
  totalToReceive: number;
  totalReceived: number;
  totalOverdue: number;
  upcomingCharges: DashboardChargeRow[];
  recentCharges: DashboardChargeRow[];
  students: DashboardStudentRow[];
  studentsActive: number;
  studentsPending: number;
  subscriptionRevenue: number;
}

export interface DashboardChargeRow {
  id: string;
  client_id: string;
  client_name: string;
  client_whatsapp: string;
  description: string;
  amount: number;
  due_date: string;
  status: string;
}
