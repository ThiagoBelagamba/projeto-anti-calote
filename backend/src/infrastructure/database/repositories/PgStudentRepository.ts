import { Student, StudentStatus } from "../../../domain/entities/Student";
import {
  CreateStudentInput,
  IStudentRepository,
  StudentListItem,
  UpdateStudentOnCheckoutInput,
} from "../../../domain/repositories/IStudentRepository";
import { mapPgUniqueToAppError } from "../../../shared/pgErrors";
import { db } from "../connection";

export class PgStudentRepository implements IStudentRepository {
  async findByEmail(email: string): Promise<Student | null> {
    const row = await db("students").where({ email: email.toLowerCase() }).first();
    return row || null;
  }

  async findByDocumentAndEmail(
    document: string,
    email: string
  ): Promise<Student | null> {
    const row = await db("students")
      .where({ document, email: email.toLowerCase() })
      .first();
    return row || null;
  }

  async findById(id: string): Promise<Student | null> {
    const row = await db("students").where({ id }).first();
    return row || null;
  }

  async findAllWithSubscriptions(): Promise<StudentListItem[]> {
    const students = await db("students").orderBy("created_at", "desc");
    const result: StudentListItem[] = [];

    for (const s of students) {
      const sub = await db("subscriptions")
        .where({ student_id: s.id })
        .orderBy("created_at", "desc")
        .first();

      result.push({
        id: s.id,
        name: s.name,
        email: s.email,
        whatsapp: s.whatsapp,
        document: s.document,
        status: s.status,
        created_at: s.created_at,
        plan: sub?.plan ?? null,
        subscription_status: sub?.status ?? null,
        subscription_value: sub ? parseFloat(String(sub.value)) : null,
      });
    }

    return result;
  }

  async create(data: CreateStudentInput): Promise<Student> {
    try {
      const [row] = await db("students")
        .insert({
          name: data.name,
          email: data.email.toLowerCase(),
          password_hash: data.password_hash,
          document: data.document,
          whatsapp: data.whatsapp,
          asaas_customer_id: data.asaas_customer_id ?? null,
          status: data.status || "PENDING",
        })
        .returning("*");
      return row;
    } catch (err) {
      const mapped = mapPgUniqueToAppError(err);
      if (mapped) throw mapped;
      throw err;
    }
  }

  async updateOnCheckout(id: string, data: UpdateStudentOnCheckoutInput): Promise<void> {
    const update: Record<string, unknown> = {
      password_hash: data.password_hash,
      whatsapp: data.whatsapp,
    };
    if (data.asaas_customer_id !== undefined) {
      update.asaas_customer_id = data.asaas_customer_id;
    }
    if (data.name) update.name = data.name;
    await db("students").where({ id }).update(update);
  }

  async updateStatus(id: string, status: StudentStatus): Promise<void> {
    await db("students").where({ id }).update({ status });
  }

  async updateAsaasCustomerId(id: string, asaasCustomerId: string): Promise<void> {
    await db("students").where({ id }).update({ asaas_customer_id: asaasCustomerId });
  }
}
