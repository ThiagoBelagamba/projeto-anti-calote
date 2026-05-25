interface BadgeProps {
  score: number;
}

// Score com cores semânticas: verde=bom pagador, âmbar=atenção, vermelho=risco
export function ScoreBadge({ score }: BadgeProps) {
  let color = "bg-red-500/20 text-red-400 border-red-500/30";
  if (score > 80) color = "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
  else if (score >= 50) color = "bg-amber-500/20 text-amber-400 border-amber-500/30";

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${color}`}>
      Score {score}
    </span>
  );
}

// Status com cores padrão: verde=pago/ativo, âmbar=pendente, vermelho=vencido, cinza=cancelado
export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    PAID: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    ACTIVE: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    OVERDUE: "bg-red-500/20 text-red-400 border-red-500/30",
    CANCELLED: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  };

  const labels: Record<string, string> = {
    PENDING: "Pendente",
    PAID: "Pago",
    ACTIVE: "Ativo",
    OVERDUE: "Vencido",
    CANCELLED: "Cancelado",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${colors[status] || colors.PENDING}`}
    >
      {labels[status] || status}
    </span>
  );
}
