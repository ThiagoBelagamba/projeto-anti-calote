"use client";

import { useState } from "react";
import { Reveal } from "../ui/Reveal";
import Link from "next/link";

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div id="pricing" className="py-24 bg-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-white tracking-tight uppercase sm:text-4xl">
              Acesso Exclusivo
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-slate-400 mx-auto">
              Preço transparente, sem surpresas, para que você foque no crescimento.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="flex justify-center mb-12">
            <div className="relative flex items-center p-1 bg-slate-900 rounded-full border border-slate-800">
              <button
                onClick={() => setIsAnnual(false)}
                className={`relative w-32 py-2 text-sm font-bold uppercase transition-colors rounded-full z-10 ${
                  !isAnnual ? "text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`relative w-32 py-2 text-sm font-bold uppercase transition-colors rounded-full z-10 ${
                  isAnnual ? "text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Anual
              </button>
              <div
                className={`absolute top-1 bottom-1 w-32 bg-red-600 rounded-full transition-transform duration-300 ease-in-out ${
                  isAnnual ? "translate-x-full" : "translate-x-0"
                }`}
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="max-w-lg mx-auto bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-red-900/30 transform transition-transform hover:scale-105 relative">
            {isAnnual && (
              <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-bl-lg">
                2 Meses Grátis
              </div>
            )}
            <div className="px-6 py-8 sm:p-10 sm:pb-6">
              <div className="flex justify-center">
                <span className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-red-600/10 text-red-500">
                  Plano Pro
                </span>
              </div>
              <div className="mt-4 flex justify-center text-6xl font-black text-white tracking-tighter">
                <span className="text-2xl mt-2 mr-2 text-slate-400 font-medium">R$</span>
                {isAnnual ? "1.800" : "180"}
                <span className="text-xl font-medium text-slate-400 self-end mb-2">/{isAnnual ? "ano" : "mês"}</span>
              </div>
            </div>
            <div className="px-6 pt-6 pb-8 sm:px-10 sm:pt-6 sm:pb-10">
              <ul className="space-y-4">
                {[
                  "Alunos Ilimitados",
                  "Cobranças Automáticas via WhatsApp",
                  "Dashboard Financeiro",
                  "Integração PIX",
                  "Suporte Prioritário",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-base text-slate-300">{feature}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <Link
                  href="/assinar"
                  className="block w-full text-center px-6 py-4 rounded-md shadow bg-red-600 text-white font-bold uppercase tracking-wide hover:bg-red-700 transition-colors"
                >
                  Garantir Minha Vaga
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
