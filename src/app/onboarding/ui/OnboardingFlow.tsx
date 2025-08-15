"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import LevelTest from "./LevelTest";

type UserRole = "DEV" | "QA" | "PM" | "UIUX" | "DEVOPS" | "OTHER";
type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "UNKNOWN";
type Goal = "INTERVIEW" | "DAILY" | "BUG_REPORT" | "CODE_REVIEW" | "PRESENT_DEMO" | "NEGOTIATE_SALARY";

type OnboardingState = {
  consentVoice: boolean;
  micGranted: boolean;
  role: UserRole;
  level: CEFRLevel;
  goals: Goal[];
  levelTestCompleted: boolean;
  testResults?: any;
};

const STORAGE_KEY = "techspeak.onboarding";

function loadState(): OnboardingState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as OnboardingState;
  } catch {
    return null;
  }
}

function saveState(state: OnboardingState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export default function OnboardingFlow() {
  const [step, setStep] = useState<number>(1);
  const [state, setState] = useState<OnboardingState>(() =>
    loadState() ?? {
      consentVoice: false,
      micGranted: false,
      role: "OTHER",
      level: "UNKNOWN",
      goals: [],
      levelTestCompleted: false,
    }
  );
  const [micError, setMicError] = useState<string | null>(null);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const canNext = useMemo(() => {
    if (step === 1) return state.consentVoice;
    if (step === 2) return state.micGranted;
    if (step === 3) return state.role !== "OTHER" && state.level !== "UNKNOWN";
    if (step === 4) return state.levelTestCompleted;
    if (step === 5) return state.goals.length > 0;
    return true;
  }, [step, state]);

  const requestMic = useCallback(async () => {
    setMicError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // stop tracks to free device after permission
      stream.getTracks().forEach((t) => t.stop());
      setState((s) => ({ ...s, micGranted: true }));
    } catch (err) {
      setMicError("Não foi possível acessar o microfone. Verifique as permissões do navegador.");
      setState((s) => ({ ...s, micGranted: false }));
    }
  }, []);

  const toggleGoal = (g: Goal) => {
    setState((s) => {
      const exists = s.goals.includes(g);
      const goals = exists ? s.goals.filter((x) => x !== g) : [...s.goals, g];
      return { ...s, goals };
    });
  };

  const finish = () => {
    saveState(state);
    // redirecionar para dashboard
    window.location.href = "/dashboard";
  };

  return (
    <div className="max-w-2xl">
      <ol className="flex gap-2 text-xs text-black/60 mb-6">
        {[1, 2, 3, 4, 5].map((n) => (
          <li key={n} className={`px-2 py-1 rounded border ${n === step ? "border-black/40" : "border-black/10"}`}>
            Passo {n}
          </li>
        ))}
      </ol>

      {step === 1 && (
        <section className="rounded-xl border border-black/10 p-5">
          <h2 className="text-lg font-semibold">Consentimento de uso de voz</h2>
          <p className="mt-2 text-sm text-black/70">
            Para analisar sua fala e oferecer feedback, precisamos do seu consentimento para processar seus dados de voz.
          </p>
          <label className="mt-4 flex items-center gap-2">
            <input
              type="checkbox"
              checked={state.consentVoice}
              onChange={(e) => setState((s) => ({ ...s, consentVoice: e.target.checked }))}
            />
            <span className="text-sm">Concordo em permitir o processamento anônimo da minha voz.</span>
          </label>
        </section>
      )}

      {step === 2 && (
        <section className="rounded-xl border border-black/10 p-5">
          <h2 className="text-lg font-semibold">Permissão de Microfone</h2>
          <p className="mt-2 text-sm text-black/70">Conceda acesso ao microfone para treinar com o Coach de Conversação.</p>
          <div className="mt-4 flex items-center gap-3">
            <button onClick={requestMic} className="h-10 px-4 rounded-full border border-black/10 bg-black text-white">
              Solicitar Permissão
            </button>
            {state.micGranted && <span className="text-sm text-green-700">Permissão concedida ✓</span>}
          </div>
          {micError && <p className="mt-2 text-sm text-red-600">{micError}</p>}
        </section>
      )}

      {step === 3 && (
        <section className="rounded-xl border border-black/10 p-5">
          <h2 className="text-lg font-semibold">Seu perfil</h2>
          <div className="mt-4 grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium">Função</label>
              <select
                className="mt-2 w-full rounded border border-black/10 h-10 px-3"
                value={state.role}
                onChange={(e) => setState((s) => ({ ...s, role: e.target.value as UserRole }))}
              >
                <option value="OTHER">Selecione...</option>
                <option value="DEV">Desenvolvedor</option>
                <option value="QA">QA</option>
                <option value="PM">Product Manager</option>
                <option value="UIUX">UI/UX Designer</option>
                <option value="DEVOPS">DevOps</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Nível (CEFR)</label>
              <select
                className="mt-2 w-full rounded border border-black/10 h-10 px-3"
                value={state.level}
                onChange={(e) => setState((s) => ({ ...s, level: e.target.value as CEFRLevel }))}
              >
                <option value="UNKNOWN">Selecione...</option>
                {(["A1", "A2", "B1", "B2", "C1", "C2"] as CEFRLevel[]).map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>
      )}

      {step === 4 && (
        <LevelTest
          onComplete={(level, testResults) => {
            setState((s) => ({ 
              ...s, 
              level: level as CEFRLevel, 
              levelTestCompleted: true,
              testResults 
            }));
            setStep(5);
          }}
          onSkip={() => {
            setState((s) => ({ ...s, levelTestCompleted: true }));
            setStep(5);
          }}
        />
      )}

      {step === 5 && (
        <section className="rounded-xl border border-black/10 p-5">
          <h2 className="text-lg font-semibold">Seus objetivos</h2>
          <p className="mt-2 text-sm text-black/70">Selecione pelo menos um cenário prioritário.</p>
          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            {(
              [
                ["INTERVIEW", "Entrevista de Emprego"],
                ["DAILY", "Daily Scrum"],
                ["BUG_REPORT", "Reportando um Bug"],
                ["CODE_REVIEW", "Code Review"],
                ["PRESENT_DEMO", "Apresentar Demo"],
                ["NEGOTIATE_SALARY", "Negociar Salário"],
              ] as [Goal, string][]
            ).map(([value, label]) => (
              <label key={value} className="flex items-center gap-2 rounded-xl border border-black/10 p-3 hover:bg-black/5">
                <input
                  type="checkbox"
                  checked={state.goals.includes(value)}
                  onChange={() => toggleGoal(value)}
                />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>
        </section>
      )}

      {step === 6 && (
        <section className="rounded-xl border border-black/10 p-5">
          <h2 className="text-lg font-semibold">Resumo</h2>
          <ul className="mt-3 text-sm text-black/80 space-y-1">
            <li>Consentimento: {state.consentVoice ? "Sim" : "Não"}</li>
            <li>Microfone: {state.micGranted ? "OK" : "Sem acesso"}</li>
            <li>Função: {state.role}</li>
            <li>Nível: {state.level} {state.testResults && `(Score: ${state.testResults.score}/3)`}</li>
            <li>Objetivos: {state.goals.join(", ") || "—"}</li>
          </ul>
        </section>
      )}

      <div className="mt-6 flex items-center justify-between">
        <button
          disabled={step === 1}
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          className="h-10 px-4 rounded-full border border-black/10 hover:bg-black/5 disabled:opacity-50"
        >
          Voltar
        </button>
        {step < 6 ? (
          <button
            disabled={!canNext}
            onClick={() => setStep((s) => Math.min(6, s + 1))}
            className="h-10 px-4 rounded-full border border-black/10 bg-black text-white disabled:opacity-50"
          >
            Avançar
          </button>
        ) : (
          <button onClick={finish} className="h-10 px-4 rounded-full border border-black/10 bg-black text-white">
            Concluir e ir ao Dashboard
          </button>
        )}
      </div>
    </div>
  );
}


