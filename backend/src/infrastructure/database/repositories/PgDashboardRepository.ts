import {
  DashboardChargeRow,
  DashboardSummary,
  IDashboardRepository,
} from "../../../domain/repositories/IDashboardRepository";
import { db } from "../connection";

function toDateStr(d: Date | string): string {
  if (typeof d === "string") return d.split("T")[0];
  return d.toISOString().split("T")[0];
}

function mapRow(c: Record<string, unknown>): DashboardChargeRow {
  return {
    id: String(c.id),
    client_id: String(c.client_id),
    client_name: String(c.client_name || "-"),
    client_whatsapp: String(c.client_whatsapp || ""),
    description: String(c.description || ""),
    amount: parseFloat(String(c.amount)),
    due_date: toDateStr(c.due_date as Date | string),
    status: String(c.status),
  };
}

export class PgDashboardRepository implements IDashboardRepository {
  async getSummary(userId: string): Promise<DashboardSummary> {
    const charges = await db("charges")
      .join("clients", "charges.client_id", "clients.id")
      .where("clients.user_id", userId)
      .select(
        "charges.*",
        "clients.name as client_name",
        "clients.whatsapp as client_whatsapp"
      )
      .orderBy("charges.due_date", "desc");

    const today = new Date().toISOString().split("T")[0];

    let totalToReceive = 0;
    let totalReceived = 0;
    let totalOverdue = 0;
    const upcomingCharges: DashboardChargeRow[] = [];
    const recentCharges: DashboardChargeRow[] = [];

    for (const row of charges) {
      const c = mapRow(row);
      const dueStr = c.due_date;

      if (c.status === "PENDING") {
        totalToReceive += c.amount;
        if (dueStr >= today) {
          upcomingCharges.push(c);
        }
      } else if (c.status === "PAID") {
        totalReceived += c.amount;
      } else if (c.status === "OVERDUE") {
        totalOverdue += c.amount;
        totalToReceive += c.amount;
      }

      recentCharges.push(c);
    }

    upcomingCharges.sort((a, b) => a.due_date.localeCompare(b.due_date));

    return {
      totalToReceive,
      totalReceived,
      totalOverdue,
      upcomingCharges: upcomingCharges.slice(0, 10),
      recentCharges: recentCharges.slice(0, 15),
      students: [],
      studentsActive: 0,
      studentsPending: 0,
      subscriptionRevenue: 0,
    };
  }
}
