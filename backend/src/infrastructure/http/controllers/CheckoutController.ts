import axios from "axios";
import { Request, Response, NextFunction } from "express";
import { PLANS, PlanType } from "../../../domain/plans";
import { GetPaymentStatusUseCase } from "../../../usecases/checkout/GetPaymentStatusUseCase";
import { RegisterAndSubscribeUseCase } from "../../../usecases/checkout/RegisterAndSubscribeUseCase";
import { SendSubscriptionReminderUseCase } from "../../../usecases/checkout/SendSubscriptionReminderUseCase";

export class CheckoutController {
  constructor(
    private registerAndSubscribe: RegisterAndSubscribeUseCase,
    private getPaymentStatus: GetPaymentStatusUseCase,
    private sendSubscriptionReminder: SendSubscriptionReminderUseCase
  ) {}

  plans = (_req: Request, res: Response) => {
    res.json({
      monthly: {
        label: PLANS.monthly.label,
        value: PLANS.monthly.value,
        cycle: PLANS.monthly.cycle,
        monthlyEquivalent: PLANS.monthly.value,
      },
      annual: {
        label: PLANS.annual.label,
        value: PLANS.annual.value,
        cycle: PLANS.annual.cycle,
        monthlyEquivalent: PLANS.annual.value / 12,
        savings: PLANS.monthly.value * 12 - PLANS.annual.value,
      },
    });
  };

  registerAndSubscribeHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {
        email,
        password,
        document,
        name,
        whatsapp,
        plano,
        plan,
        credit_card,
        credit_card_holder_info,
      } = req.body;

      const selectedPlan = (plan || plano) as PlanType;

      const result = await this.registerAndSubscribe.execute({
        email,
        password,
        document,
        name,
        whatsapp,
        plan: selectedPlan,
        credit_card,
        credit_card_holder_info,
      });

      res.status(201).json(result);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data) {
        const data = err.response.data as {
          errors?: Array<{ description: string }>;
        };
        if (data.errors?.length) {
          const msg = data.errors.map((e) => e.description).join("; ");
          const status = err.response.status >= 400 ? err.response.status : 400;
          res.status(status).json({ success: false, message: msg });
          return;
        }
      }
      next(err);
    }
  };

  sendReminder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.sendSubscriptionReminder.execute(String(req.params.studentId));
      res.json({ message: "Lembrete enviado com sucesso" });
    } catch (err) {
      next(err);
    }
  };

  paymentStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const asaasPaymentId = String(req.query.asaas_payment_id || "");
      if (!asaasPaymentId) {
        res.status(400).json({ error: "asaas_payment_id é obrigatório" });
        return;
      }
      const result = await this.getPaymentStatus.execute(asaasPaymentId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  };
}
