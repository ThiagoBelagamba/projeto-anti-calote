import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  accent?: "red" | "emerald" | "amber" | "sky";
}

// Mapa de acentos com cores semânticas por contexto do card
const accents = {
  red: "text-red-400 bg-red-500/10",
  emerald: "text-emerald-400 bg-emerald-500/10",
  amber: "text-amber-400 bg-amber-500/10",
  sky: "text-sky-400 bg-sky-500/10",
};

export function StatCard({ title, value, icon: Icon, accent = "sky" }: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="mt-2 text-2xl font-bold text-white">{value}</p>
        </div>
        <div className={`rounded-lg p-2.5 ${accents[accent]}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}
