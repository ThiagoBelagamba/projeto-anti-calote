"use client";

import { usePathname } from "next/navigation";
import { AppShell } from "./AppShell";

const PUBLIC_PREFIXES = ["/assinar", "/obrigado"];

export function ShellWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));

  if (isPublic) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
        {children}
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
