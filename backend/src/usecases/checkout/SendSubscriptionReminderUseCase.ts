import { PLANS } from "../../domain/plans";
import { IStudentRepository } from "../../domain/repositories/IStudentRepository";
import { ISubscriptionRepository } from "../../domain/repositories/ISubscriptionRepository";
import { AsaasClientService } from "../../infrastructure/services/AsaasClientService";
import { EvolutionApiService } from "../../infrastructure/services/EvolutionApiService";
import { AppError } from "../../shared/AppError";

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export class SendSubscriptionReminderUseCase {
  constructor(
    private studentRepo: IStudentRepository,
    private subscriptionRepo: ISubscriptionRepository,
    private asaasService: AsaasClientService,
    private evolutionService: EvolutionApiService
  ) {}

  async execute(studentId: string): Promise<void> {
    const student = await this.studentRepo.findById(studentId);
    if (!student) throw new AppError("Aluno não encontrado", 404);
    if (!student.whatsapp) throw new AppError("Aluno sem WhatsApp", 400);

    const subscription = await this.subscriptionRepo.findByStudentId(studentId);
    if (!subscription) throw new AppError("Assinatura não encontrada", 404);
    if (subscription.status === "CANCELLED") {
      throw new AppError("Assinatura cancelada", 400);
    }

    if (!subscription.asaas_subscription_id) {
      throw new AppError("Assinatura sem vínculo no Asaas", 400);
    }

    const paymentUrl = await this.asaasService.resolveSubscriptionPaymentUrl(
      subscription.asaas_subscription_id,
      subscription.asaas_payment_id
    );

    if (!paymentUrl) {
      throw new AppError("Link de pagamento indisponível no Asaas", 400);
    }

    const planLabel =
      subscription.plan === "annual"
        ? PLANS.annual.label
        : PLANS.monthly.label;

    const text = [
      "📋 Lembrete — mensalidade da academia",
      "",
      `Olá, ${student.name.split(" ")[0]}!`,
      `Plano: ${planLabel}`,
      `Valor: ${formatCurrency(subscription.value)}`,
      "",
      "Link para pagar sua fatura:",
      paymentUrl,
    ].join("\n");

    await this.evolutionService.sendMessage(student.whatsapp, text);
  }
}
