import { AppError } from "./AppError";

const CARD_AUTH_MESSAGE =
  "Transação não autorizada. Verifique os dados do cartão de crédito e tente novamente.";

export function isCardAuthorizationError(err: unknown): boolean {
  return err instanceof AppError && err.message.includes(CARD_AUTH_MESSAGE);
}
