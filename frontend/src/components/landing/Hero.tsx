import { Reveal } from "../ui/Reveal";

export function Hero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-20">
      {/* Background glow accents */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-red-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-red-900 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <Reveal>
          {/* Badge de posicionamento B2B */}
          <div className="inline-block border border-red-600/30 bg-red-600/10 text-red-500 uppercase tracking-widest text-xs font-bold px-4 py-1.5 rounded-full mb-8">
            Sistema de Gestão de Cobranças para Empresas
          </div>
        </Reveal>

        <Reveal delay={100}>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-tight mb-6">
            Foque no seu <span className="text-red-600">Negócio</span>. <br />
            Nós eliminamos a <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Inadimplência</span>.
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <p className="mt-4 text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Automatize as cobranças dos clientes da sua empresa via WhatsApp, reduza a inadimplência a zero e tenha controle total do financeiro sem esforço.
          </p>
        </Reveal>

        <Reveal delay={300}>
          {/* Estatísticas de impacto */}
          <div className="flex flex-wrap justify-center gap-8 mb-10">
            <div className="text-center">
              <p className="text-4xl font-black text-red-500">-90%</p>
              <p className="text-slate-400 text-sm uppercase tracking-wide mt-1">Inadimplência</p>
            </div>
            <div className="w-px bg-slate-800 hidden sm:block" />
            <div className="text-center">
              <p className="text-4xl font-black text-red-500">100%</p>
              <p className="text-slate-400 text-sm uppercase tracking-wide mt-1">Automático</p>
            </div>
            <div className="w-px bg-slate-800 hidden sm:block" />
            <div className="text-center">
              <p className="text-4xl font-black text-red-500">+R$</p>
              <p className="text-slate-400 text-sm uppercase tracking-wide mt-1">Recuperado</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={400}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#lead-form"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-md text-white bg-red-600 hover:bg-red-700 uppercase tracking-wide transition-all transform hover:scale-105"
            >
              Começar Agora
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-md text-white bg-white/5 hover:bg-white/10 border border-white/10 uppercase tracking-wide transition-all"
            >
              Como Funciona
            </a>
          </div>
        </Reveal>
      </div>

      {/* Linha decorativa inferior */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-600/50 to-transparent"></div>
    </div>
  );
}
