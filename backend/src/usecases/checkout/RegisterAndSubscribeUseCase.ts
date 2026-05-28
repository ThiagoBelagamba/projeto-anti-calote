import bcrypt from "bcrypt";
import { PlanType, getPlan, isValidPlan } from "../../domain/plans";
import { Student } from "../../domain/entities/Student";
import { IStudentRepository } from "../../domain/repositories/IStudentRepository";
import { ISubscriptionRepository } from "../../domain/repositories/ISubscriptionRepository";
import {
  AsaasClientService,
  CreditCardHolderInfoInput,
  CreditCardInput,
} from "../../infrastructure/services/AsaasClientService";
import { AppError } from "../../shared/AppError";
import { formatWhatsappForEvolution } from "../../shared/formatWhatsapp";
import { mapPgUniqueToAppError } from "../../shared/pgErrors";
import { db } from "../../infrastructure/database/connection";

export interface RegisterAndSubscribeDTO {
  email: string;
  password: string;
  document: string;
  name: string;
  whatsapp: string;
  plan: PlanType;
  credit_card: CreditCardInput;
  credit_card_holder_info: CreditCardHolderInfoInput;
}

export interface RegisterAndSubscribeResult {
  success: boolean;
  subscription_id: string;
  student_id: string;
  asaas_payment_id: string | null;
  asaas_subscription_id: string;
  invoice_url?: string;
  status: string;
}

export class RegisterAndSubscribeUseCase {
  constructor(
    private studentRepo: IStudentRepository,
    private subscriptionRepo: ISubscriptionRepository,
    private asaasService: AsaasClientService
  ) {}

  async execute(dto: RegisterAndSubscribeDTO): Promise<RegisterAndSubscribeResult> {
    this.validate(dto);

    const document = dto.document.replace(/\D/g, "");
    const email = dto.email.toLowerCase().trim();
    const planConfig = getPlan(dto.plan);
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const whatsapp = formatWhatsappForEvolution(dto.whatsapp);

    const existingStudent = await this.studentRepo.findByDocumentAndEmail(
      document,
      email
    );

    if (existingStudent) {
      const blocking = await this.subscriptionRepo.hasBlockingSubscription(
        existingStudent.id
      );
      if (blocking) {
        throw new AppError(
          "Já existe uma assinatura ativa para este CPF e e-mail",
          409
        );
      }
    } else {
      const existingUser = await db("users").where({ email }).first();
      if (existingUser) {
        throw new AppError("Email já cadastrado como administrador", 409);
      }
    }

    const asaasCustomerId =
      (await this.asaasService.findCustomerByDocument(document)) ??
      (await this.asaasService.createCustomer({
        name: dto.name,
        cpfCnpj: document,
        email,
        mobilePhone: whatsapp,
      }));

    const student = await this.resolveStudent({
      existingStudent,
      dto,
      document,
      email,
      passwordHash,
      whatsapp,
      asaasCustomerId,
    });

    const asaasResult = await this.asaasService.createSubscriptionWithCard({
      customerId: asaasCustomerId,
      value: planConfig.value,
      cycle: planConfig.cycle,
      description: planConfig.description,
      creditCard: dto.credit_card,
      creditCardHolderInfo: dto.credit_card_holder_info,
    });

    const isActive =
      asaasResult.status === "ACTIVE" || asaasResult.status === "CONFIRMED";

    const subscription = await this.subscriptionRepo.create({
      student_id: student.id,
      plan: dto.plan,
      value: planConfig.value,
      status: isActive ? "ACTIVE" : "PENDING",
      asaas_subscription_id: asaasResult.subscriptionId,
      asaas_payment_id: asaasResult.paymentId,
    });

    if (isActive) {
      await this.studentRepo.updateStatus(student.id, "ACTIVE");
      await this.subscriptionRepo.updateStatus(
        subscription.id,
        "ACTIVE",
        new Date()
      );
    }

    return {
      success: true,
      subscription_id: subscription.id,
      student_id: student.id,
      asaas_payment_id: asaasResult.paymentId,
      asaas_subscription_id: asaasResult.subscriptionId,
      invoice_url: asaasResult.invoiceUrl,
      status: subscription.status,
    };
  }

  private async resolveStudent(params: {
    existingStudent: Student | null;
    dto: RegisterAndSubscribeDTO;
    document: string;
    email: string;
    passwordHash: string;
    whatsapp: string;
    asaasCustomerId: string;
  }): Promise<Student> {
    const { existingStudent, dto, document, email, passwordHash, whatsapp, asaasCustomerId } =
      params;

    if (existingStudent) {
      await this.studentRepo.updateOnCheckout(existingStudent.id, {
        password_hash: passwordHash,
        whatsapp,
        asaas_customer_id: asaasCustomerId,
        name: dto.name,
      });

      await this.upsertUser(email, dto.name, whatsapp, passwordHash);

      return { ...existingStudent, whatsapp, asaas_customer_id: asaasCustomerId };
    }

    const student = await this.studentRepo.create({
      name: dto.name,
      email,
      password_hash: passwordHash,
      document,
      whatsapp,
      asaas_customer_id: asaasCustomerId,
      status: "PENDING",
    });

    await this.upsertUser(email, dto.name, whatsapp, passwordHash);

    return student;
  }

  private async upsertUser(
    email: string,
    name: string,
    whatsapp: string,
    passwordHash: string
  ): Promise<void> {
    const existingUser = await db("users").where({ email }).first();
    if (existingUser) {
      await db("users").where({ email }).update({
        password_hash: passwordHash,
        name,
        whatsapp,
      });
      return;
    }

    try {
      await db("users").insert({
        name,
        email,
        whatsapp,
        password_hash: passwordHash,
      });
    } catch (err) {
      const mapped = mapPgUniqueToAppError(err);
      if (mapped) throw mapped;
      throw err;
    }
  }

  private validate(dto: RegisterAndSubscribeDTO): void {
    if (!isValidPlan(dto.plan)) {
      throw new AppError("Plano inválido", 400);
    }
    if (!dto.email?.includes("@")) {
      throw new AppError("Email inválido", 400);
    }
    if (!dto.password || dto.password.length < 6) {
      throw new AppError("Senha deve ter pelo menos 6 caracteres", 400);
    }
    const doc = dto.document?.replace(/\D/g, "") || "";
    if (doc.length !== 11) {
      throw new AppError("CPF inválido", 400);
    }
    const nameParts = dto.name?.trim().split(/\s+/) || [];
    if (nameParts.length < 2) {
      throw new AppError("Informe nome e sobrenome", 400);
    }
    try {
      formatWhatsappForEvolution(dto.whatsapp || "");
    } catch {
      throw new AppError(
        "Telefone inválido. Use DDD + número, ex: 16999998888 ou 5516999998888",
        400
      );
    }

    const cardNumber = dto.credit_card?.number?.replace(/\s/g, "") || "";
    if (cardNumber.length < 13 || cardNumber.length > 19) {
      throw new AppError("Número do cartão inválido", 400);
    }
    if (!dto.credit_card?.holderName?.trim()) {
      throw new AppError("Nome no cartão é obrigatório", 400);
    }
    if (!/^\d{3,4}$/.test(dto.credit_card?.ccv || "")) {
      throw new AppError("CVV inválido", 400);
    }

    const holder = dto.credit_card_holder_info;
    if (!holder?.postalCode || holder.postalCode.replace(/\D/g, "").length !== 8) {
      throw new AppError("CEP inválido", 400);
    }
    if (!holder?.addressNumber?.trim()) {
      throw new AppError("Número do endereço é obrigatório", 400);
    }
  }
}
