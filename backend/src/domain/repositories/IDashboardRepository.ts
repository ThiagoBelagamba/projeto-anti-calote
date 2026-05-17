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

export interface IDashboardRepository {
  getSummary(userId: string): Promise<DashboardSummary>;
}
