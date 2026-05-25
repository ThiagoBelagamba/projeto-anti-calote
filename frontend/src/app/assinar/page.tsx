"use client";

import { FormEvent, useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertCircle, Eye, EyeOff, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  getPlans,
  registerAndSubscribe,
  PlanType,
  PlansResponse,
} from "@/lib/checkout-api";
import { formatCardExpiry, formatCpf, formatCurrency } from "@/lib/formatters";
import { getApiErrorMessage } from "@/lib/api-errors";

function AssinarForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [plans, setPlans] = useState<PlansResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    plan: "monthly" as PlanType,
    email: "",
    password: "",
    name: "",
    document: "",
    whatsapp: "",
    cep: "",
    address_street: "",
    address_district: "",
    address_city: "",
    address_state: "",
    address_number: "",
    card_number: "",
    card_name: "",
    card_expiry: "",
    card_cvv: "",
  });

  useEffect(() => {
    getPlans().then(setPlans).catch(() => {});
    const p = searchParams.get("plano");
    if (p === "mensal" || p === "anual") {
      setForm((f) => ({ ...f, plan: p === "anual" ? "annual" : "monthly" }));
    }
  }, [searchParams]);

  const handleCepBlur = async () => {
    const cep = form.cep.replace(/\D/g, "");
    if (cep.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (data.erro) return;
      setForm((prev) => ({
        ...prev,
        address_street: data.logradouro || prev.address_street,
        address_district: data.bairro || prev.address_district,
        address_city: data.localidade || prev.address_city,
        address_state: data.uf || prev.address_state,
      }));
    } catch {
      setError("Não foi possível buscar o CEP.");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const expiryParts = form.card_expiry.split("/");
      const mm = expiryParts[0]?.trim();
      const yy = expiryParts[1]?.trim();
      if (!mm || !yy || mm.length !== 2 || yy.length !== 2) {
        setError("Validade do cartão inválida. Use MM/AA.");
        setLoading(false);
        return;
      }

      const result = await registerAndSubscribe({
        email: form.email,
        password: form.password,
        document: form.document.replace(/\D/g, ""),
        name: form.name,
        whatsapp: form.whatsapp.replace(/\D/g, ""),
        plan: form.plan,
        credit_card: {
          holderName: form.card_name,
          number: form.card_number.replace(/\s/g, ""),
          expiryMonth: mm,
          expiryYear: `20${yy}`,
          ccv: form.card_cvv,
        },
        credit_card_holder_info: {
          name: form.name,
          email: form.email,
          cpfCnpj: form.document.replace(/\D/g, ""),
          postalCode: form.cep.replace(/\D/g, ""),
          addressNumber: form.address_number,
          phone: form.whatsapp.replace(/\D/g, ""),
        },
      });

      if (result.success) {
        const planoParam = form.plan === "monthly" ? "mensal" : "anual";
        router.push(`/obrigado?plano=${planoParam}`);
      } else {
        setError(result.message || "Erro ao processar assinatura");
      }
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Erro ao conectar com o servidor."));
    } finally {
      setLoading(false);
    }
  };

  const monthlyValue = plans?.monthly.value ?? 180;
  const annualValue = plans?.annual.value ?? 1800;
  const savings = plans?.annual.savings ?? monthlyValue * 12 - annualValue;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8 flex items-center gap-3">
        <Dumbbell className="h-8 w-8 text-red-600" />
        <div>
          <h1 className="text-2xl font-bold text-white">Assine sua matrícula</h1>
          <p className="text-slate-400">Plano mensal ou anual — pagamento no cartão</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 rounded-xl border border-slate-800 bg-slate-900/80 p-6"
      >
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            1. Escolha seu plano
          </h2>
          <div className="grid gap-3">
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                form.plan === "monthly"
                  ? "border-red-600 bg-red-600/10"
                  : "border-slate-700 hover:border-slate-600"
              }`}
            >
              <input
                type="radio"
                name="plan"
                checked={form.plan === "monthly"}
                onChange={() => setForm({ ...form, plan: "monthly" })}
                className="accent-red-600"
              />
              <div>
                <span className="font-semibold text-white">Mensal</span>
                <span className="text-slate-400"> — {formatCurrency(monthlyValue)}/mês</span>
                <p className="mt-0.5 text-sm text-slate-500">Cobrança recorrente mensal</p>
              </div>
            </label>
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                form.plan === "annual"
                  ? "border-red-600 bg-red-600/10"
                  : "border-slate-700 hover:border-slate-600"
              }`}
            >
              <input
                type="radio"
                name="plan"
                checked={form.plan === "annual"}
                onChange={() => setForm({ ...form, plan: "annual" })}
                className="accent-red-600"
              />
              <div>
                <span className="font-semibold text-white">Anual</span>
                <span className="text-slate-400"> — {formatCurrency(annualValue)}/ano</span>
                <span className="ml-2 rounded-full bg-emerald-600 px-2 py-0.5 text-xs text-white">
                  Economize {formatCurrency(savings)}
                </span>
                <p className="mt-0.5 text-sm text-slate-500">Melhor custo-benefício</p>
              </div>
            </label>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            2. Seus dados
          </h2>
          <Input label="Nome completo *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Email *" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <div className="relative">
            <Input
              label="Senha *"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-slate-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <Input
            label="CPF *"
            value={form.document}
            onChange={(e) => setForm({ ...form, document: formatCpf(e.target.value) })}
            maxLength={14}
            required
          />
          <Input
            label="WhatsApp *"
            placeholder="5511999999999"
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            required
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            3. Endereço
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <Input label="CEP *" value={form.cep} onChange={(e) => setForm({ ...form, cep: e.target.value })} onBlur={handleCepBlur} required />
            </div>
            <Input label="Número *" value={form.address_number} onChange={(e) => setForm({ ...form, address_number: e.target.value })} required />
          </div>
          <Input label="Rua *" value={form.address_street} onChange={(e) => setForm({ ...form, address_street: e.target.value })} required />
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Bairro *" value={form.address_district} onChange={(e) => setForm({ ...form, address_district: e.target.value })} required />
            <Input label="Cidade *" value={form.address_city} onChange={(e) => setForm({ ...form, address_city: e.target.value })} required />
            <Input
              label="UF *"
              value={form.address_state}
              onChange={(e) => setForm({ ...form, address_state: e.target.value.toUpperCase().slice(0, 2) })}
              maxLength={2}
              required
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            4. Cartão de crédito
          </h2>
          <Input label="Número do cartão *" value={form.card_number} onChange={(e) => setForm({ ...form, card_number: e.target.value })} maxLength={19} required />
          <Input label="Nome no cartão *" value={form.card_name} onChange={(e) => setForm({ ...form, card_name: e.target.value.toUpperCase() })} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Validade *" placeholder="MM/AA" value={form.card_expiry} onChange={(e) => setForm({ ...form, card_expiry: formatCardExpiry(e.target.value) })} maxLength={5} required />
            <Input label="CVV *" value={form.card_cvv} onChange={(e) => setForm({ ...form, card_cvv: e.target.value })} maxLength={4} required />
          </div>
        </section>

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-red-400">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 inline animate-spin" size={18} />
              Processando...
            </>
          ) : (
            `Assinar — ${form.plan === "monthly" ? `${formatCurrency(monthlyValue)}/mês` : `${formatCurrency(annualValue)}/ano`}`
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        <Link href="/" className="text-slate-400 hover:text-white hover:underline">
          Voltar ao painel
        </Link>
      </p>
    </div>
  );
}

export default function AssinarPage() {
  return (
    <Suspense fallback={<p className="p-10 text-center text-slate-400">Carregando...</p>}>
      <AssinarForm />
    </Suspense>
  );
}
