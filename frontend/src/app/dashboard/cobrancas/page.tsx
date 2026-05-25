"use client";

import { FormEvent, useEffect, useState } from "react";
import { Bell, Plus } from "lucide-react";
import { api, Charge, Client, DashboardSummary } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/Badge";
import { ClientCell } from "@/components/ui/ClientCell";
import { getApiErrorMessage } from "@/lib/api-errors";

export default function CobrancasPage() {
  const [charges, setCharges] = useState<Charge[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [students, setStudents] = useState<DashboardSummary["students"]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sendingReminder, setSendingReminder] = useState<string | null>(null);
  const [form, setForm] = useState({
    client_id: "",
    amount: "",
    description: "",
    due_date: "",
  });

  const loadData = async () => {
    const [chargesRes, clientsRes, summaryRes] = await Promise.all([
      api.get<Charge[]>("/charges"),
      api.get<Client[]>("/clients"),
      api.get<DashboardSummary>("/dashboard/summary"),
    ]);
    setCharges(chargesRes.data);
    setClients(clientsRes.data);
    setStudents(summaryRes.data.students ?? []);
    if (clientsRes.data.length > 0 && !form.client_id) {
      setForm((f) => ({ ...f, client_id: clientsRes.data[0].id }));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/charges", {
        ...form,
        amount: parseFloat(form.amount),
      });
      setModalOpen(false);
      setForm({
        client_id: clients[0]?.id || "",
        amount: "",
        description: "",
        due_date: "",
      });
      await loadData();
    } catch {
      alert("Erro ao criar cobrança");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendChargeReminder = async (chargeId: string) => {
    setSendingReminder(`charge-${chargeId}`);
    try {
      await api.post(`/charges/${chargeId}/send-reminder`);
      alert("Lembrete enviado com o link de pagamento!");
    } catch (err) {
      alert(getApiErrorMessage(err, "Erro ao enviar lembrete."));
    } finally {
      setSendingReminder(null);
    }
  };

  const handleSendStudentReminder = async (studentId: string) => {
    setSendingReminder(`student-${studentId}`);
    try {
      await api.post(`/checkout/students/${studentId}/send-reminder`);
      alert("Lembrete enviado para o aluno!");
    } catch (err) {
      alert(getApiErrorMessage(err, "Erro ao enviar lembrete."));
    } finally {
      setSendingReminder(null);
    }
  };

  const isReminderDisabled = (status: string | null) =>
    status === "CANCELLED" || status === "ACTIVE";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Cobranças</h1>
          <p className="text-slate-400">Faturas e lembretes com link de pagamento</p>
        </div>
        <Button onClick={() => setModalOpen(true)} disabled={clients.length === 0}>
          <Plus size={18} className="mr-2 inline" />
          Nova cobrança
        </Button>
      </div>

      {loading ? (
        <p className="text-slate-400">Carregando...</p>
      ) : (
        <>
        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">
            Assinaturas da academia
          </h2>
          <DataTable
            data={students}
            emptyMessage="Nenhuma assinatura via /assinar"
            columns={[
              {
                key: "name",
                header: "Aluno",
                render: (r) => (
                  <ClientCell name={r.name} whatsapp={r.whatsapp} document={r.document} />
                ),
              },
              {
                key: "plan",
                header: "Plano",
                render: (r) => r.plan_label,
              },
              {
                key: "value",
                header: "Valor",
                render: (r) =>
                  r.subscription_value != null
                    ? formatCurrency(r.subscription_value)
                    : "-",
              },
              {
                key: "status",
                header: "Status",
                render: (r) => (
                  <StatusBadge status={r.subscription_status || r.status} />
                ),
              },
              {
                key: "actions",
                header: "Ações",
                render: (r) => {
                  const status = r.subscription_status || r.status;
                  return (
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={
                        sendingReminder === `student-${r.id}` ||
                        isReminderDisabled(status)
                      }
                      onClick={() => handleSendStudentReminder(r.id)}
                    >
                      <Bell size={14} className="mr-1 inline" />
                      {sendingReminder === `student-${r.id}`
                        ? "Enviando..."
                        : "Enviar lembrete"}
                    </Button>
                  );
                },
              },
            ]}
          />
        </div>

        <h2 className="mb-4 text-lg font-semibold text-white">Cobranças avulsas</h2>
        <DataTable
          data={charges}
          columns={[
            {
              key: "client",
              header: "Cliente",
              render: (r) => (
                <ClientCell
                  name={r.client_name}
                  whatsapp={r.client_whatsapp}
                  document={r.client_document}
                />
              ),
            },
            {
              key: "description",
              header: "Descrição",
              render: (r) => (
                <span className="text-slate-300">{r.description || "-"}</span>
              ),
            },
            {
              key: "amount",
              header: "Valor",
              render: (r) => formatCurrency(r.amount),
            },
            {
              key: "due",
              header: "Vencimento",
              render: (r) => formatDate(String(r.due_date).split("T")[0]),
            },
            {
              key: "status",
              header: "Status",
              render: (r) => <StatusBadge status={r.status} />,
            },
            {
              key: "actions",
              header: "Ações",
              render: (r) => (
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={
                    sendingReminder === `charge-${r.id}` ||
                    r.status === "PAID" ||
                    r.status === "CANCELLED"
                  }
                  onClick={() => handleSendChargeReminder(r.id)}
                >
                  <Bell size={14} className="mr-1 inline" />
                  {sendingReminder === `charge-${r.id}`
                    ? "Enviando..."
                    : "Enviar lembrete"}
                </Button>
              ),
            },
          ]}
        />
        </>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nova cobrança">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Cliente"
            value={form.client_id}
            onChange={(e) => setForm({ ...form, client_id: e.target.value })}
            options={clients.map((c) => ({ value: c.id, label: c.name }))}
          />
          <Input
            label="Valor (R$)"
            type="number"
            step="0.01"
            min="0.01"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
          />
          <Input
            label="Descrição"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
          <Input
            label="Vencimento"
            type="date"
            value={form.due_date}
            onChange={(e) => setForm({ ...form, due_date: e.target.value })}
            required
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Criando..." : "Criar cobrança"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
