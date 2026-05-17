import { ISubscriptionRepository } from "../../domain/repositories/ISubscriptionRepository";
import { IStudentRepository } from "../../domain/repositories/IStudentRepository";
import { AsaasClientService } from "../../infrastructure/services/AsaasClientService";

export class GetPaymentStatusUseCase {
  constructor(
    private subscriptionRepo: ISubscriptionRepository,
    private studentRepo: IStudentRepository,
    private asaasService: AsaasClientService
  ) {}

  async execute(asaasPaymentId: string): Promise<{ confirmed: boolean; status: string }> {
    const subscription = await this.subscriptionRepo.findByAsaasPaymentId(asaasPaymentId);
    if (!subscription) {
      return { confirmed: false, status: "NOT_FOUND" };
    }

    if (subscription.status === "ACTIVE") {
      return { confirmed: true, status: "ACTIVE" };
    }

    const asaasStatus = await this.asaasService.getPaymentStatus(asaasPaymentId);

    if (asaasStatus.confirmed) {
      await this.subscriptionRepo.updateStatus(subscription.id, "ACTIVE", new Date());
      await this.studentRepo.updateStatus(subscription.student_id, "ACTIVE");
    }

    return asaasStatus;
  }
}
