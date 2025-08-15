"use client";

import { useEffect, useMemo, useState } from "react";

type UserRole = "DEV" | "QA" | "PM" | "UIUX" | "DEVOPS" | "OTHER";
type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "UNKNOWN";
type Goal = "INTERVIEW" | "DAILY" | "BUG_REPORT" | "CODE_REVIEW" | "PRESENT_DEMO" | "NEGOTIATE_SALARY";

type OnboardingState = {
  consentVoice: boolean;
  micGranted: boolean;
  role: UserRole;
  level: CEFRLevel;
  goals: Goal[];
};

const STORAGE_KEY = "techspeak.onboarding";

export default function Recommendations() {
  const [data, setData] = useState<OnboardingState | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      setData(JSON.parse(raw) as OnboardingState);
    } catch {
      setData(null);
    }
  }, []);

  const actions = useMemo(() => {
    if (!data) return [] as { title: string; href: string; description: string }[];
    const items: { title: string; href: string; description: string }[] = [];
    if (data.goals.includes("INTERVIEW")) {
      items.push({ title: "Praticar Entrevista", href: "/coach?scenario=INTERVIEW", description: "Simule perguntas comuns e técnicas." });
    }
    if (data.goals.includes("DAILY")) {
      items.push({ title: "Praticar Daily", href: "/coach?scenario=DAILY", description: "Treine status, planos e blockers." });
    }
    if (data.goals.includes("BUG_REPORT")) {
      items.push({ title: "Reportar um Bug", href: "/tracks", description: "Estruture descrição, impacto e reprodução." });
    }
    if (data.goals.includes("CODE_REVIEW")) {
      items.push({ title: "Code Review", href: "/tracks", description: "Exercite feedback objetivo e técnico." });
    }
    if (items.length === 0) {
      items.push({ title: "Explorar Trilhas", href: "/tracks", description: "Escolha um cenário para começar." });
    }
    return items;
  }, [data]);

  if (!data) {
    return (
      <div className="rounded-xl border border-black/10 p-5">
        <h2 className="text-lg font-semibold">Personalize seu treino</h2>
        <p className="mt-2 text-sm text-black/70">Conclua o onboarding para recomendações sob medida.</p>
        <a className="mt-4 inline-flex items-center justify-center rounded-full border border-black/10 bg-black text-white h-10 px-4" href="/onboarding">
          Fazer Onboarding
        </a>
      </div>
    );
  }

  return (
    <section>
      <div className="rounded-xl border border-black/10 p-5">
        <h2 className="text-lg font-semibold">Bem-vindo</h2>
        <p className="mt-1 text-sm text-black/70">Perfil: {data.role} · Nível: {data.level}</p>
      </div>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((a) => (
          <a key={a.title} href={a.href} className="rounded-xl border border-black/10 p-5 hover:bg-black/5 transition">
            <h3 className="font-semibold">{a.title}</h3>
            <p className="mt-1 text-sm text-black/70">{a.description}</p>
          </a>
        ))}
      </div>
    </section>
  );
}


