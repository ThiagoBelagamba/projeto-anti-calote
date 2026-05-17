import { env } from "../../config/env";
import { PgChargeRepository } from "../database/repositories/PgChargeRepository";
import { PgClientRepository } from "../database/repositories/PgClientRepository";
import { PgMessageLogRepository } from "../database/repositories/PgMessageLogRepository";
import { AsaasClientService } from "../services/AsaasClientService";
import { EvolutionApiService } from "../services/EvolutionApiService";
import { BillingReguaWorker } from "./billingReguaWorker";

async function main() {
  const worker = new BillingReguaWorker(
    new PgChargeRepository(),
    new PgClientRepository(),
    new PgMessageLogRepository(),
    new AsaasClientService(),
    new EvolutionApiService()
  );

  console.log(`[Regua:once] Usuário padrão: ${env.defaultUserId}`);
  await worker.run();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
