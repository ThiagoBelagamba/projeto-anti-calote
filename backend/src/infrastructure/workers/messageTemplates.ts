import { ChargeWithClient } from "../../domain/entities/Charge";

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date + "T12:00:00") : date;
  return d.toLocaleDateString("pt-BR");
}

function paymentLinkBlock(paymentUrl: string): string {
  return `Link para pagar sua fatura:\n${paymentUrl}`;
}

export function buildDMinus1Message(charge: ChargeWithClient, paymentUrl: string): string {
  return `Olá! 😊 Lembrete amigável: sua cobrança de ${formatCurrency(charge.amount)} vence amanhã (${formatDate(charge.due_date)}).\n\n${charge.description}\n\n${paymentLinkBlock(paymentUrl)}`;
}

export function buildD0Message(charge: ChargeWithClient, paymentUrl: string): string {
  return `⚠️ Sua cobrança de ${formatCurrency(charge.amount)} vence HOJE (${formatDate(charge.due_date)}).\n\n${charge.description}\n\n${paymentLinkBlock(paymentUrl)}`;
}

export function buildOverdueMessage(
  charge: ChargeWithClient,
  daysOverdue: number,
  paymentUrl: string
): string {
  return `🚨 Cobrança em atraso há ${daysOverdue} dia(s).\n\nValor: ${formatCurrency(charge.amount)}\nVencimento: ${formatDate(charge.due_date)}\n\n${charge.description}\n\n${paymentLinkBlock(paymentUrl)}`;
}

export function buildPaidMessage(clientName: string, amount: number): string {
  return `✅ Pagamento confirmado! Obrigado, ${clientName}!\n\nRecebemos ${formatCurrency(amount)}. Qualquer dúvida, estamos à disposição.`;
}

export function buildPaymentReminderMessage(
  charge: ChargeWithClient,
  paymentUrl: string
): string {
  return `📋 Lembrete de pagamento\n\nValor: ${formatCurrency(charge.amount)}\nVencimento: ${formatDate(charge.due_date)}\n\n${charge.description}\n\n${paymentLinkBlock(paymentUrl)}`;
}

export function getMessageForRule(
  rule: string,
  charge: ChargeWithClient,
  paymentUrl: string
): string {
  switch (rule) {
    case "D-1":
      return buildDMinus1Message(charge, paymentUrl);
    case "D-0":
      return buildD0Message(charge, paymentUrl);
    case "D+1":
      return buildOverdueMessage(charge, 1, paymentUrl);
    case "D+3":
      return buildOverdueMessage(charge, 3, paymentUrl);
    case "D+5":
      return buildOverdueMessage(charge, 5, paymentUrl);
    default:
      return buildPaymentReminderMessage(charge, paymentUrl);
  }
}
