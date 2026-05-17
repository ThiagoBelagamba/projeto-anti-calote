import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config();

export const env = {
  port: parseInt(process.env.PORT || "3333", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl:
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres_senha_local@localhost:5432/anti_calote_db",
  defaultUserId:
    process.env.DEFAULT_USER_ID || "00000000-0000-4000-8000-000000000001",
  asaasApiKey: process.env.ASAAS_API_KEY || "",
  asaasApiUrl: process.env.ASAAS_API_URL || "https://sandbox.asaas.com/api/v3",
  asaasWebhookToken: process.env.ASAAS_WEBHOOK_TOKEN || "",
  asaasWebhookSkipVerify:
    process.env.ASAAS_WEBHOOK_SKIP_VERIFY === "true" &&
    (process.env.NODE_ENV || "development") !== "production",
  evolutionApiUrl: process.env.EVOLUTION_API_URL || "http://localhost:8080",
  evolutionApiKey: process.env.AUTHENTICATION_API_KEY || "anti_calote_evo_secret_123",
  evolutionInstanceName: process.env.EVOLUTION_INSTANCE_NAME || "projeto-teste",
  reguaEnabled: process.env.REGUA_ENABLED !== "false",
  reguaCron: process.env.REGUA_CRON || "0 9 * * *",
};
