import { ChargeWithClient } from "../../domain/entities/Charge";
import { IChargeRepository } from "../../domain/repositories/IChargeRepository";
import { AsaasClientService } from "../../infrastructure/services/AsaasClientService";
import { AppError } from "../../shared/AppError";

export async function resolvePaymentUrl(
  charge: ChargeWithClient,
  chargeRepo: IChargeRepository,
  asaasService: AsaasClientService
): Promise<string> {
  if (charge.payment_url) {
    return charge.payment_url;
  }

  if (!charge.asaas_payment_id) {
    throw new AppError("Cobrança sem link de pagamento no Asaas", 400);
  }

  const payment = await asaasService.getPayment(charge.asaas_payment_id);
  const url = asaasService.resolvePaymentPageUrl(payment);

  if (!url) {
    throw new AppError("Link de pagamento indisponível no Asaas", 400);
  }

  await chargeRepo.updatePaymentUrl(charge.id, url);
  return url;
}
