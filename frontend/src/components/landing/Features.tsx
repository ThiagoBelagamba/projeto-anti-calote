import { Reveal } from "../ui/Reveal";
import { DollarSign, MessageCircle, ShieldCheck, Zap } from "lucide-react";

export function Features() {
  const features = [
    {
      name: "Cobrança Automática",
      description: "Mensagens programadas via WhatsApp para lembrar seus alunos antes, no dia e depois do vencimento.",
      icon: MessageCircle,
    },
    {
      name: "Pagamentos em 1 Clique",
      description: "Integração nativa com PIX. O aluno recebe o código copia e cola no próprio WhatsApp.",
      icon: Zap,
    },
    {
      name: "Dashboard Financeiro",
      description: "Acompanhe tudo em tempo real: recebidos, a receber e inadimplentes, em um painel claro e direto.",
      icon: DollarSign,
    },
    {
      name: "Bloqueio Inteligente",
      description: "Configurou a regra? Se o aluno não pagar, o status atualiza automaticamente para bloqueado.",
      icon: ShieldCheck,
    },
  ];

  return (
    <div id="features" className="py-24 bg-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center">
            <h2 className="text-3xl font-black text-white tracking-tight uppercase sm:text-4xl">
              Tudo que você precisa
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-slate-400 mx-auto">
              Desenvolvido para donos de academia que não têm tempo a perder.
            </p>
          </div>
        </Reveal>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Reveal key={feature.name} delay={index * 100} direction="up">
                <div className="pt-6">
                  <div className="flow-root bg-slate-900 rounded-lg px-6 pb-8 border border-slate-800 hover:border-red-600/50 transition-colors h-full">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-red-600 rounded-md shadow-lg">
                          <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-bold text-white tracking-wide uppercase">
                        {feature.name}
                      </h3>
                      <p className="mt-5 text-base text-slate-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
