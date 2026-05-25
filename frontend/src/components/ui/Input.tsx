import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = "", ...props }: InputProps) {
  return (
    <label className="block space-y-1">
      {label && <span className="text-sm text-slate-400">{label}</span>}
      <input
        className={`w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-slate-500 ${className}`}
        {...props}
      />
    </label>
  );
}
