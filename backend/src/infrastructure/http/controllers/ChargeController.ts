import { Request, Response, NextFunction } from "express";
import { ChargeStatus } from "../../../domain/entities/Charge";
import { CreateChargeUseCase } from "../../../usecases/charges/CreateChargeUseCase";
import { ListChargesUseCase } from "../../../usecases/charges/ListChargesUseCase";
import { SendPaymentReminderUseCase } from "../../../usecases/charges/SendPaymentReminderUseCase";

export class ChargeController {
  constructor(
    private listCharges: ListChargesUseCase,
    private createCharge: CreateChargeUseCase,
    private sendPaymentReminder: SendPaymentReminderUseCase
  ) {}

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const status = req.query.status as ChargeStatus | undefined;
      const clientId = req.query.clientId as string | undefined;
      const charges = await this.listCharges.execute({ status, clientId });
      res.json(charges);
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { client_id, amount, description, due_date } = req.body;
      const charge = await this.createCharge.execute({
        client_id,
        amount: parseFloat(amount),
        description,
        due_date,
      });
      res.status(201).json(charge);
    } catch (err) {
      next(err);
    }
  };

  sendReminder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.sendPaymentReminder.execute(String(req.params.id));
      res.json({ message: "Lembrete enviado com sucesso" });
    } catch (err) {
      next(err);
    }
  };
}
