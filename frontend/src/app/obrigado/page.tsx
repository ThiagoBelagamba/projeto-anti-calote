"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/Button";

function ObrigadoContent() {
  const searchParams = useSearchParams();
  const plano = searchParams.get("plano") || "mensal";
  const planoLabel = plano === "anual" ? "Anual (R$ 1.800/ano)" : "Mensal (R$ 180/mês)";

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <CheckCircle2 className="mb-6 h-16 w-16 text-emerald-400" />
      <div className="mb-4 flex items-center justify-center gap-2">
        <Dumbbell className="h-6 w-6 text-emerald-400" />
        <h1 className="text-2xl font-bold text-white">Matrícula confirmada!</h1>
      </div>
      <p className="mb-2 text-slate-300">
        Sua assinatura <strong className="text-white">{planoLabel}</strong> foi registrada com sucesso.
      </p>
      <p className="mb-8 text-sm text-slate-500">
        O pagamento está sendo processado. Em breve você receberá um e-mail com os detalhes de acesso à academia.
      </p>
      <Link href="/">
        <Button>Ir para o painel</Button>
      </Link>
    </div>
  );
}

export default function ObrigadoPage() {
  return (
    <Suspense fallback={<p className="p-10 text-center text-slate-400">Carregando...</p>}>
      <ObrigadoContent />
    </Suspense>
  );
}
