/**
 * Formata telefone para Evolution API: apenas dígitos, com 55 (Brasil) no início.
 * Ex.: (16) 99419-4747 → 5516994194747
 */
export function formatWhatsappForEvolution(phone: string): string {
  let digits = phone.replace(/\D/g, "");
  if (!digits) {
    throw new Error("Telefone vazio");
  }

  while (digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  if (!digits.startsWith("55")) {
    if (digits.length === 10 || digits.length === 11) {
      digits = `55${digits}`;
    } else {
      throw new Error(
        `Telefone inválido (${phone}). Use DDD + número, ex: 16999998888`
      );
    }
  }

  // 55 + DDD (2) + 8 dígitos — celular antigo sem o 9
  if (digits.length === 12) {
    const ddd = digits.slice(2, 4);
    const local = digits.slice(4);
    if (local.length === 8 && /^[6789]/.test(local)) {
      digits = `55${ddd}9${local}`;
    }
  }

  if (digits.length < 12 || digits.length > 13) {
    throw new Error(
      `Telefone inválido após formatação (${digits.length} dígitos). Esperado 12–13 com código 55.`
    );
  }

  return digits;
}
