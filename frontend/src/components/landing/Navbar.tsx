"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-md border-b border-white/10 py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-black text-white tracking-tighter uppercase">
              Anti<span className="text-red-600">Calote</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#features" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
                Funcionalidades
              </a>
              <a href="#how-it-works" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
                Como Funciona
              </a>
              <a href="#pricing" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
                Planos
              </a>
            </div>
          </div>
          <div>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
            >
              Entrar
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
