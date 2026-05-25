import { Reveal } from "../ui/Reveal";

export function HowItWorks() {
  const steps = [
    {
      id: "01",
      title: "Cadastre seus Alunos",
      description: "Importe sua lista ou cadastre manualmente. Nós geramos o link de pagamento único para cada um.",
    },
    {
      id: "02",
      title: "Defina a Régua de Cobrança",
      description: "Escolha quantos dias antes e depois do vencimento o aluno deve ser lembrado pelo WhatsApp.",
    },
    {
      id: "03",
      title: "Acompanhe os Recebimentos",
      description: "O aluno paga, o sistema dá baixa automática, libera o acesso e o dinheiro cai na sua conta.",
    },
  ];

  return (
    <div id="how-it-works" className="py-24 bg-slate-950 relative border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-20">
            <h2 className="text-3xl font-black text-white tracking-tight uppercase sm:text-4xl">
              Como Funciona
            </h2>
          </div>
        </Reveal>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-800" aria-hidden="true" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {steps.map((step, index) => (
              <Reveal key={step.id} delay={index * 200} direction="up" className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center w-24 h-24 rounded-full bg-black border-4 border-slate-900 text-red-600 font-black text-3xl mb-6 relative z-10 shadow-[0_0_30px_rgba(220,38,38,0.2)]">
                    {step.id}
                  </div>
                  <h3 className="text-xl font-bold text-white uppercase mb-4">{step.title}</h3>
                  <p className="text-slate-400">{step.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
