import { Student, StudentStatus } from "../entities/Student";

export interface CreateStudentInput {
  name: string;
  email: string;
  password_hash: string;
  document: string;
  whatsapp: string;
  asaas_customer_id?: string | null;
  status?: StudentStatus;
}

export interface StudentListItem {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  document: string;
  status: StudentStatus;
  created_at: Date;
  plan: string | null;
  subscription_status: string | null;
  subscription_value: number | null;
}

export interface IStudentRepository {
  findByEmail(email: string): Promise<Student | null>;
  findById(id: string): Promise<Student | null>;
  findAllWithSubscriptions(): Promise<StudentListItem[]>;
  create(data: CreateStudentInput): Promise<Student>;
  updateStatus(id: string, status: StudentStatus): Promise<void>;
  updateAsaasCustomerId(id: string, asaasCustomerId: string): Promise<void>;
}
