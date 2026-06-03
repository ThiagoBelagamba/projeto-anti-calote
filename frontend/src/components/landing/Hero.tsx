import { Reveal } from "../ui/Reveal";

export function Hero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-20">
      {/* Background brutalist accents */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-red-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-red-900 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <Reveal>
          <div className="inline-block border border-red-600/30 bg-red-600/10 text-red-500 uppercase tracking-widest text-xs font-bold px-4 py-1.5 rounded-full mb-8">
            Sistema Anti Calote
          </div>
        </Reveal>

        <Reveal delay={100}>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-tight mb-6">
            Foque no <span className="text-red-600">Treino</span>. <br />
            Nós cuidamos das <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Cobranças</span>.
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <p className="mt-4 text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Automatize as cobranças via WhatsApp, reduza a inadimplência a zero e tenha controle total do seu financeiro sem esforço.
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#lead-form"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-md text-white bg-red-600 hover:bg-red-700 uppercase tracking-wide transition-all transform hover:scale-105"
            >
              Comece Agora
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

      {/* Decorative skewed lines typical of sport brutalism */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-600/50 to-transparent"></div>
    </div>
  );
}
