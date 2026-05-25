import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-black border-t border-slate-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-2xl font-black text-white tracking-tighter uppercase mb-4 inline-block">
              Anti<span className="text-red-600">Calote</span>
            </Link>
            <p className="text-slate-400 max-w-sm mt-4">
              O sistema de gestão feito de dono para dono. Simplifique suas cobranças e acabe com a inadimplência na sua academia.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-4">Navegação</h4>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-slate-400 hover:text-red-500 transition-colors">Funcionalidades</a>
              </li>
              <li>
                <a href="#how-it-works" className="text-slate-400 hover:text-red-500 transition-colors">Como Funciona</a>
              </li>
              <li>
                <a href="#pricing" className="text-slate-400 hover:text-red-500 transition-colors">Planos</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-4">Acesso</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="text-slate-400 hover:text-red-500 transition-colors">Login Admin</Link>
              </li>

            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} AntiCalote. Todos os direitos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="text-slate-500 text-sm">Feito para acelerar o seu negócio.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
