import axios from "axios";
import { AppError } from "./AppError";

export function parseAsaasAxiosError(err: unknown): AppError {
  if (axios.isAxiosError(err) && err.response?.data) {
    const data = err.response.data as {
      errors?: Array<{ description: string }>;
    };
    if (data.errors?.length) {
      const msg = data.errors.map((e) => e.description).join("; ");
      const status =
        err.response.status >= 400 && err.response.status < 500
          ? err.response.status
          : 400;
      return new AppError(msg, status);
    }
  }
  return new AppError("Erro na integração com Asaas", 502);
}
