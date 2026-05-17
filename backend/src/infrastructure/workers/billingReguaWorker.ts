import cron from "node-cron";
import { env } from "../../config/env";
import { IChargeRepository } from "../../domain/repositories/IChargeRepository";
import { IClientRepository } from "../../domain/repositories/IClientRepository";
import { IMessageLogRepository } from "../../domain/repositories/IMessageLogRepository";
import { resolvePaymentUrl } from "../../usecases/charges/resolvePaymentUrl";
import { AsaasClientService } from "../services/AsaasClientService";
import { EvolutionApiService } from "../services/EvolutionApiService";
import { getMessageForRule } from "./messageTemplates";

const REGUA_RULES = ["D-1", "D-0", "D+1", "D+3", "D+5"];
const OVERDUE_SCORE_PENALTY = 5;

export class BillingReguaWorker {
  constructor(
    private chargeRepo: IChargeRepository,
    private clientRepo: IClientRepository,
    private messageLogRepo: IMessageLogRepository,
    private asaasService: AsaasClientService,
    private evolutionService: EvolutionApiService
  ) {}

  start(): void {
    if (!env.reguaEnabled) {
      console.log("[Regua] Cron desabilitado (REGUA_ENABLED=false)");
      return;
    }

    cron.schedule(env.reguaCron, () => {
      this.run().catch((err) => console.error("[Regua] Erro no cron:", err));
    });
    console.log(
      `[Regua] Cron agendado (${env.reguaCron}) — instância Evolution: ${env.evolutionInstanceName}`
    );
  }

  async run(): Promise<void> {
    const today = new Date().toISOString().split("T")[0];
    console.log(`[Regua] Executando régua para ${today}`);

    const overdueCount = await this.chargeRepo.markOverdue(today);
    if (overdueCount > 0) {
      console.log(`[Regua] ${overdueCount} cobrança(s) marcada(s) como OVERDUE`);
    }

    for (const rule of REGUA_RULES) {
      const charges = await this.chargeRepo.findForRegua(rule, today);

      for (const charge of charges) {
        const alreadySent = await this.messageLogRepo.exists(charge.id, rule);
        if (alreadySent) continue;
        if (!charge.client_whatsapp) continue;

        try {
          const paymentUrl = await resolvePaymentUrl(
            charge,
            this.chargeRepo,
            this.asaasService
          );
          const text = getMessageForRule(rule, charge, paymentUrl);
          await this.evolutionService.sendMessage(charge.client_whatsapp, text);
          await this.messageLogRepo.create(charge.id, rule);

          if (rule.startsWith("D+")) {
            const client = await this.clientRepo.findById(charge.client_id);
            if (client) {
              await this.clientRepo.updateScore(
                client.id,
                client.score - OVERDUE_SCORE_PENALTY
              );
            }
          }

          console.log(`[Regua] ${rule} enviado para cobrança ${charge.id}`);
        } catch (err) {
          console.error(`[Regua] Falha ao enviar ${rule} para ${charge.id}:`, err);
        }
      }
    }
  }
}
