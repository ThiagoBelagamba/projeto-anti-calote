import { Charge, ChargeStatus, ChargeWithClient } from "../../../domain/entities/Charge";
import {
  CreateChargeInput,
  IChargeRepository,
} from "../../../domain/repositories/IChargeRepository";
import { db } from "../connection";

function mapChargeRow(row: Record<string, unknown>): ChargeWithClient {
  return {
    ...row,
    amount: parseFloat(String(row.amount)),
  } as ChargeWithClient;
}

export class PgChargeRepository implements IChargeRepository {
  private baseQuery() {
    return db("charges")
      .join("clients", "charges.client_id", "clients.id")
      .select(
        "charges.*",
        "clients.name as client_name",
        "clients.whatsapp as client_whatsapp",
        "clients.document as client_document"
      );
  }

  async findAll(filters?: {
    userId?: string;
    status?: ChargeStatus;
    clientId?: string;
  }): Promise<ChargeWithClient[]> {
    let query = this.baseQuery();
    if (filters?.userId) query = query.where("clients.user_id", filters.userId);
    if (filters?.status) query = query.where("charges.status", filters.status);
    if (filters?.clientId) query = query.where("charges.client_id", filters.clientId);
    const rows = await query.orderBy("charges.due_date", "desc");
    return rows.map(mapChargeRow);
  }

  async findById(id: string): Promise<ChargeWithClient | null> {
    const row = await this.baseQuery().where("charges.id", id).first();
    return row ? mapChargeRow(row) : null;
  }

  async findByAsaasPaymentId(asaasPaymentId: string): Promise<Charge | null> {
    const row = await db("charges").where({ asaas_payment_id: asaasPaymentId }).first();
    return row ? { ...row, amount: parseFloat(String(row.amount)) } : null;
  }

  async create(data: CreateChargeInput): Promise<Charge> {
    const [row] = await db("charges")
      .insert({
        client_id: data.client_id,
        amount: data.amount,
        description: data.description,
        due_date: data.due_date,
        status: data.status || "PENDING",
        asaas_payment_id: data.asaas_payment_id ?? null,
        pix_payload: data.pix_payload ?? null,
        payment_url: data.payment_url ?? null,
      })
      .returning("*");
    return { ...row, amount: parseFloat(String(row.amount)) };
  }

  async updateStatus(id: string, status: ChargeStatus): Promise<void> {
    await db("charges").where({ id }).update({ status });
  }

  async updatePaymentUrl(id: string, paymentUrl: string): Promise<void> {
    await db("charges").where({ id }).update({ payment_url: paymentUrl });
  }

  async findForRegua(rule: string, referenceDate: string): Promise<ChargeWithClient[]> {
    let targetDate: string;
    const statuses: ChargeStatus[] = ["PENDING", "OVERDUE"];

    switch (rule) {
      case "D-1":
        targetDate = addDays(referenceDate, 1);
        break;
      case "D-0":
        targetDate = referenceDate;
        break;
      case "D+1":
        targetDate = addDays(referenceDate, -1);
        break;
      case "D+3":
        targetDate = addDays(referenceDate, -3);
        break;
      case "D+5":
        targetDate = addDays(referenceDate, -5);
        break;
      default:
        return [];
    }

    const rows = await this.baseQuery()
      .whereIn("charges.status", statuses)
      .whereRaw("charges.due_date::date = ?::date", [targetDate]);

    if (rule.startsWith("D+")) {
      return rows.filter((r) => {
        const due = new Date(r.due_date);
        const ref = new Date(referenceDate);
        return due < ref;
      }).map(mapChargeRow);
    }

    return rows.map(mapChargeRow);
  }

  async markOverdue(referenceDate: string): Promise<number> {
    return db("charges")
      .where("status", "PENDING")
      .whereRaw("due_date::date < ?::date", [referenceDate])
      .update({ status: "OVERDUE" });
  }
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}
