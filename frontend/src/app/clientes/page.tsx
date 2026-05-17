"use client";

import { FormEvent, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { api, Client } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { DataTable } from "@/components/ui/DataTable";
import { ScoreBadge } from "@/components/ui/Badge";

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", whatsapp: "", document: "" });

  const loadClients = () => {
    api
      .get<Client[]>("/clients")
      .then((res) => setClients(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/clients", form);
      setModalOpen(false);
      setForm({ name: "", whatsapp: "", document: "" });
      loadClients();
    } catch {
      alert("Erro ao cadastrar cliente");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Clientes</h1>
          <p className="text-slate-400">Gerencie seus clientes e scores</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={18} className="mr-2 inline" />
          Novo cliente
        </Button>
      </div>

      {loading ? (
        <p className="text-slate-400">Carregando...</p>
      ) : (
        <DataTable
          data={clients}
          columns={[
            { key: "name", header: "Nome", render: (r) => r.name },
            { key: "whatsapp", header: "WhatsApp", render: (r) => r.whatsapp },
            { key: "document", header: "CPF/CNPJ", render: (r) => r.document },
            {
              key: "score",
              header: "Score",
              render: (r) => <ScoreBadge score={r.score} />,
            },
          ]}
        />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Novo cliente">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            label="WhatsApp (com DDD)"
            placeholder="5511999999999"
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            required
          />
          <Input
            label="CPF/CNPJ"
            value={form.document}
            onChange={(e) => setForm({ ...form, document: e.target.value })}
            required
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
