import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ShellWrapper } from "@/components/layout/ShellWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Anti-Calote | Gestão de Cobranças",
  description: "Sistema de cobrança automática via WhatsApp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} antialiased`}>
        <ShellWrapper>{children}</ShellWrapper>
      </body>
    </html>
  );
}
