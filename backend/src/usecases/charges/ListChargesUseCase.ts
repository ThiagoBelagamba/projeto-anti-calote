import { ChargeStatus, ChargeWithClient } from "../../domain/entities/Charge";
import { IChargeRepository } from "../../domain/repositories/IChargeRepository";

export class ListChargesUseCase {
  constructor(
    private chargeRepo: IChargeRepository,
    private userId: string
  ) {}

  async execute(filters?: {
    status?: ChargeStatus;
    clientId?: string;
  }): Promise<ChargeWithClient[]> {
    return this.chargeRepo.findAll({ ...filters, userId: this.userId });
  }
}
