import ngrok from "@ngrok/ngrok";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const port = parseInt(
  process.env.TUNNEL_PORT || process.env.PORT || "3333",
  10
);
const token = process.env.NGROK_AUTHTOKEN;

const URL_REGEX = /https:\/\/[a-z0-9-]+\.ngrok-free\.dev/i;

async function closeExistingTunnels(): Promise<void> {
  try {
    for (const listener of await ngrok.listeners()) {
      const url = listener.url();
      if (url) await ngrok.disconnect(url);
    }
  } catch {
    // ignore
  }
  try {
    await ngrok.kill();
  } catch {
    // ignore
  }
}

function printExistingTunnelHelp(message: string): boolean {
  if (!message.includes("already online")) return false;

  const existingUrl = message.match(URL_REGEX)?.[0];
  if (!existingUrl) return false;

  console.log("\nUm túnel com este domínio já está ativo na sua conta ngrok.\n");
  console.log("Use esta URL (com o backend rodando em npm run dev):");
  console.log(`  ${existingUrl}`);
  console.log(`  Webhook Asaas: ${existingUrl}/api/webhooks/asaas\n`);
  console.log("Para substituir o túnel:");
  console.log("  1. Feche outros terminais com npm run tunnel");
  console.log("  2. Rode: npm run tunnel:stop");
  console.log("  3. Encerre agentes em https://dashboard.ngrok.com/agents");
  console.log("  4. Rode npm run tunnel novamente\n");
  return true;
}

async function main() {
  if (!token) {
    console.error("NGROK_AUTHTOKEN não definido no .env");
    process.exit(1);
  }

  console.log(`Abrindo túnel ngrok → localhost:${port}...`);
  console.log("(O backend precisa estar rodando: npm run dev)\n");

  await closeExistingTunnels();

  let listener;
  try {
    listener = await ngrok.forward({
      addr: port,
      authtoken: token,
      pooling_enabled: true,
      force_new_session: true,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);

    if (printExistingTunnelHelp(message)) {
      process.exit(0);
    }

    throw err;
  }

  const url = listener.url();
  if (!url) {
    console.error("Não foi possível obter a URL do túnel.");
    process.exit(1);
  }

  console.log(`Túnel ativo: ${url}`);
  console.log(`Webhook Asaas: ${url}/api/webhooks/asaas`);
  console.log("\nMantendo túnel aberto. Pressione Ctrl+C para encerrar.\n");

  const keepAlive = setInterval(() => {}, 60_000);

  const shutdown = async () => {
    clearInterval(keepAlive);
    console.log("\nEncerrando túnel...");
    await listener.close();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);

  if (printExistingTunnelHelp(message)) {
    process.exit(0);
  }

  console.error("Erro ao iniciar túnel:", message);
  process.exit(1);
});
