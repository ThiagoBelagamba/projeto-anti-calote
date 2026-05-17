import axios from "axios";
import { env } from "../../config/env";
import { formatWhatsappForEvolution } from "../../shared/formatWhatsapp";
import { AppError } from "../../shared/AppError";

export class EvolutionApiService {
  async sendMessage(phone: string, text: string): Promise<void> {
    let number: string;
    try {
      number = formatWhatsappForEvolution(phone);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Telefone inválido";
      throw new AppError(msg, 400);
    }

    const instance = env.evolutionInstanceName;

    try {
      await axios.post(
        `${env.evolutionApiUrl}/message/sendText/${instance}`,
        { number, text },
        {
          headers: {
            apikey: env.evolutionApiKey,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const detail =
          (err.response?.data as { message?: string; response?: { message?: string } })
            ?.response?.message ||
          (err.response?.data as { message?: string })?.message ||
          err.message;
        console.error("[Evolution] Falha ao enviar:", {
          instance,
          number,
          status: err.response?.status,
          detail,
        });
        throw new AppError(
          `Evolution API: ${detail}. Instância: ${instance}, número: ${number}`,
          err.response?.status === 400 ? 400 : 502
        );
      }
      throw err;
    }
  }
}
