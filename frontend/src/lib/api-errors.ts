import axios from "axios";

type ApiErrorBody = {
  message?: string;
  error?: string;
  errors?: Array<{ description?: string }>;
};

export function getApiErrorMessage(
  err: unknown,
  fallback = "Erro ao processar. Tente novamente."
): string {
  if (!axios.isAxiosError(err)) {
    return err instanceof Error ? err.message : fallback;
  }

  if (!err.response) {
    return "Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:3333";
  }

  const data = err.response.data as ApiErrorBody | undefined;
  if (data?.message) return data.message;
  if (data?.error) return data.error;
  if (data?.errors?.length) {
    return data.errors
      .map((e) => e.description)
      .filter(Boolean)
      .join("; ");
  }

  return fallback;
}
