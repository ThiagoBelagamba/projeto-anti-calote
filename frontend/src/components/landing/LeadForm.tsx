"use client";

import { useState } from "react";
import { Reveal } from "../ui/Reveal";
import { api } from "@/lib/api";

export function LeadForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    company_name: "", // Nome da empresa contratante
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Envia lead da empresa para o backend
      await api.post("/leads", formData);
      setSuccess(true);
      setFormData({ name: "", email: "", whatsapp: "", company_name: "" });
    } catch (err) {
      alert("Ocorreu um erro ao enviar seus dados. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="lead-form" className="py-24 bg-slate-950 relative border-t border-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="bg-gradient-to-br from-slate-900 to-black rounded-3xl p-8 md:p-12 shadow-2xl border border-red-900/50">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-white tracking-tight uppercase">
                Pronto para acabar com a inadimplência?
              </h2>
              <p className="mt-4 text-slate-400 text-lg">
                Preencha os dados abaixo e um especialista entrará em contato para ativar sua conta empresarial.
              </p>
            </div>

            {success ? (
              <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">Recebemos seus dados!</h3>
                <p className="text-slate-300">Entraremos em contato no WhatsApp informado o mais rápido possível.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2 uppercase tracking-wider text-xs">
                      Seu Nome
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                      placeholder="João da Silva"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2 uppercase tracking-wider text-xs">
                      E-mail Corporativo
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                      placeholder="joao@suaempresa.com.br"
                    />
                  </div>
                  <div>
                    <label htmlFor="whatsapp" className="block text-sm font-medium text-slate-300 mb-2 uppercase tracking-wider text-xs">
                      WhatsApp
                    </label>
                    <input
                      type="text"
                      id="whatsapp"
                      required
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div>
                    <label htmlFor="company_name" className="block text-sm font-medium text-slate-300 mb-2 uppercase tracking-wider text-xs">
                      Nome da Empresa
                    </label>
                    <input
                      type="text"
                      id="company_name"
                      required
                      value={formData.company_name}
                      onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                      placeholder="Empresa Ltda."
                    />
                  </div>
                </div>
                <div className="pt-4 text-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center px-10 py-4 text-lg font-bold rounded-md text-white bg-red-600 hover:bg-red-700 uppercase tracking-wide transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                  >
                    {loading ? "Enviando..." : "Quero Contratar"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
