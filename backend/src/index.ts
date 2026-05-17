import { env } from "./config/env";
import { createServer } from "./infrastructure/http/server";
import { PgChargeRepository } from "./infrastructure/database/repositories/PgChargeRepository";
import { PgClientRepository } from "./infrastructure/database/repositories/PgClientRepository";
import { PgMessageLogRepository } from "./infrastructure/database/repositories/PgMessageLogRepository";
import { AsaasClientService } from "./infrastructure/services/AsaasClientService";
import { EvolutionApiService } from "./infrastructure/services/EvolutionApiService";
import { BillingReguaWorker } from "./infrastructure/workers/billingReguaWorker";

const app = createServer();

const reguaWorker = new BillingReguaWorker(
  new PgChargeRepository(),
  new PgClientRepository(),
  new PgMessageLogRepository(),
  new AsaasClientService(),
  new EvolutionApiService()
);

reguaWorker.start();

const server = app.listen(env.port, () => {
  console.log(`Backend rodando em http://localhost:${env.port}`);
  console.log(`Health: http://localhost:${env.port}/health`);
  console.log(`API: http://localhost:${env.port}/api`);
});

server.on("error", (err: NodeJS.ErrnoException) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\nPorta ${env.port} em uso. Rode: npm run kill-port`);
    console.error("Ou use: npm run dev:clean\n");
    process.exit(1);
  }
  throw err;
});
