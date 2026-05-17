import {
  DashboardSummary,
  IDashboardRepository,
} from "../../domain/repositories/IDashboardRepository";
import { IStudentRepository } from "../../domain/repositories/IStudentRepository";

const PLAN_LABELS: Record<string, string> = {
  monthly: "Mensal",
  annual: "Anual",
};

export class GetDashboardSummaryUseCase {
  constructor(
    private dashboardRepo: IDashboardRepository,
    private studentRepo: IStudentRepository,
    private userId: string
  ) {}

  async execute(): Promise<DashboardSummary> {
    const [summary, studentRows] = await Promise.all([
      this.dashboardRepo.getSummary(this.userId),
      this.studentRepo.findAllWithSubscriptions(),
    ]);

    const students = studentRows.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      whatsapp: s.whatsapp,
      document: s.document,
      status: s.status,
      plan: s.plan,
      plan_label: s.plan ? PLAN_LABELS[s.plan] || s.plan : "-",
      subscription_status: s.subscription_status,
      subscription_value: s.subscription_value,
      created_at:
        s.created_at instanceof Date
          ? s.created_at.toISOString()
          : String(s.created_at),
    }));

    const studentsActive = students.filter((s) => s.status === "ACTIVE").length;
    const studentsPending = students.filter((s) => s.status === "PENDING").length;
    const subscriptionRevenue = students
      .filter((s) => s.status === "ACTIVE" && s.subscription_value)
      .reduce((sum, s) => sum + (s.subscription_value || 0), 0);

    return {
      ...summary,
      students,
      studentsActive,
      studentsPending,
      subscriptionRevenue,
    };
  }
}
