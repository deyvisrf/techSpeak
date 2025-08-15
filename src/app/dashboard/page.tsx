"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { FreemiumBanner } from "@/components/ui/FreemiumBanner";

// Dynamic imports to avoid SSR issues with localStorage
const Recommendations = dynamic(() => import("./ui/Recommendations"), { ssr: false });
const MicWarning = dynamic(() => import("./ui/MicWarning"), { ssr: false });

export default function DashboardPage() {
  return (
    <div className="min-h-screen px-4 py-8 sm:px-8 sm:py-12 lg:px-20">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-sm sm:text-base text-black/70">Acesso rápido às principais áreas do MVP.</p>

      {/* Banner freemium */}
      <div className="mt-6">
        <FreemiumBanner />
      </div>

      {/* Aviso de microfone */}
      <div className="mt-6">
        <MicWarning />
      </div>

      <div className="mt-8">
        {/* Recomendações baseadas no Onboarding */}
        <Recommendations />
      </div>

      <div className="mt-8 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/tracks" className="rounded-xl border border-black/10 p-4 sm:p-5 hover:bg-black/5 transition touch-manipulation">
          <h3 className="font-semibold text-base sm:text-lg">Trilhas</h3>
          <p className="mt-1 text-xs sm:text-sm text-black/70">Escolha cenários como Entrevista, Daily, Bug Report.</p>
        </Link>
        <Link href="/coach" className="rounded-xl border border-black/10 p-4 sm:p-5 hover:bg-black/5 transition touch-manipulation">
          <h3 className="font-semibold text-base sm:text-lg">Coach de Conversação</h3>
          <p className="mt-1 text-xs sm:text-sm text-black/70">Treino de fala em tempo real com IA.</p>
        </Link>
        <Link href="/progress" className="rounded-xl border border-black/10 p-4 sm:p-5 hover:bg-black/5 transition touch-manipulation sm:col-span-2 lg:col-span-1">
          <h3 className="font-semibold text-base sm:text-lg">Progresso</h3>
          <p className="mt-1 text-xs sm:text-sm text-black/70">Acompanhe seus indicadores de aprendizado.</p>
        </Link>
      </div>
    </div>
  );
}




