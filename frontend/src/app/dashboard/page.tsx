"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Wallet, AlertTriangle, Users } from "lucide-react";
import { api, DashboardSummary, DashboardChargeRow } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/format";
import { StatCard } from "@/components/ui/StatCard";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/Badge";
import { ClientCell } from "@/components/ui/ClientCell";

const EMPTY = "-";

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<DashboardSummary>("/dashboard/summary")
      .then((res) => setSummary(res.data))
      .catch(() => setError("Erro ao carregar dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-slate-400">Carregando...</p>;
  }

  if (error || !summary) {
    return <p className="text-red-400">{error || "Dados indisponíveis"}</p>;
  }

  const chargeColumns = [
    {
      key: "client",
      header: "Cliente",
      render: (r: DashboardChargeRow) => (
        <ClientCell name={r.client_name} whatsapp={r.client_whatsapp} />
      ),
    },
    {
      key: "description",
      header: "Descrição",
      render: (r: DashboardChargeRow) => (
        <span className="text-slate-300">{r.description || EMPTY}</span>
      ),
    },
    {
      key: "amount",
      header: "Valor",
      render: (r: DashboardChargeRow) => formatCurrency(r.amount),
    },
    {
      key: "due",
      header: "Vencimento",
      render: (r: DashboardChargeRow) => formatDate(r.due_date),
    },
    {
      key: "status",
      header: "Status",
      render: (r: DashboardChargeRow) => <StatusBadge status={r.status} />,
    },
  ];

  const studentColumns = [
    {
      key: "name",
      header: "Aluno",
      render: (r: (typeof summary.students)[0]) => (
        <ClientCell name={r.name} whatsapp={r.whatsapp} document={r.document} />
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (r: (typeof summary.students)[0]) => (
        <span className="text-slate-300">{r.email}</span>
      ),
    },
    {
      key: "plan",
      header: "Plano",
      render: (r: (typeof summary.students)[0]) => (
        <span className="text-white">{r.plan_label}</span>
      ),
    },
    {
      key: "value",
      header: "Valor",
      render: (r: (typeof summary.students)[0]) =>
        r.subscription_value != null
          ? formatCurrency(r.subscription_value)
          : EMPTY,
    },
    {
      key: "status",
      header: "Status",
      render: (r: (typeof summary.students)[0]) => (
        <StatusBadge status={r.subscription_status || r.status} />
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400">Cobranças e assinaturas do Anti Calote</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Alunos ativos"
          value={String(summary.studentsActive ?? 0)}
          icon={Users}
          accent="sky"
        />
        <StatCard
          title="Receita assinaturas"
          value={formatCurrency(summary.subscriptionRevenue ?? 0)}
          icon={TrendingUp}
          accent="emerald"
        />
        <StatCard
          title="Total a receber"
          value={formatCurrency(summary.totalToReceive)}
          icon={Wallet}
          accent="amber"
        />
        <StatCard
          title="Inadimplência"
          value={formatCurrency(summary.totalOverdue)}
          icon={AlertTriangle}
          accent="red"
        />
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">
          Alunos matriculados (assinaturas)
        </h2>
        <DataTable
          data={summary.students ?? []}
          emptyMessage="Nenhum aluno assinou ainda. Compartilhe o link /assinar"
          columns={studentColumns}
        />
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">Próximas cobranças</h2>
        <DataTable
          data={summary.upcomingCharges ?? []}
          emptyMessage="Nenhuma cobrança próxima do vencimento"
          columns={chargeColumns}
        />
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">Cobranças recentes</h2>
        <DataTable
          data={summary.recentCharges ?? []}
          emptyMessage="Nenhuma cobrança cadastrada"
          columns={chargeColumns}
        />
      </div>
    </div>
  );
}
