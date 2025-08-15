"use client";

import { useEffect, useState } from "react";

type OnboardingState = {
  micGranted: boolean;
};

const STORAGE_KEY = "techspeak.onboarding";

export default function MicWarning() {
  const [micGranted, setMicGranted] = useState<boolean | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw) as OnboardingState;
      setMicGranted(!!data?.micGranted);
    } catch {
      setMicGranted(null);
    }
  }, []);

  const requestMic = async () => {
    setMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
      setMicGranted(true);
      // persistir flag no storage
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const data = raw ? JSON.parse(raw) : {};
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, micGranted: true }));
      } catch {}
    } catch {
      setMessage("Não foi possível acessar o microfone. Verifique as permissões do navegador.");
    }
  };

  if (micGranted === null || micGranted) return null;

  return (
    <div className="rounded-xl border border-black/10 p-5 bg-[#fff7ed]">
      <div className="flex items-center justify-between gap-4 flex-col sm:flex-row">
        <div>
          <h2 className="font-semibold">Permissão de microfone pendente</h2>
          <p className="text-sm text-black/70">Conceda acesso para usar o Coach de Conversação.</p>
          {message && <p className="mt-1 text-sm text-red-600">{message}</p>}
        </div>
        <div className="flex gap-3">
          <button onClick={requestMic} className="h-10 px-4 rounded-full border border-black/10 bg-black text-white">Conceder agora</button>
          <a href="/onboarding" className="h-10 px-4 rounded-full border border-black/10 hover:bg-black/5 inline-flex items-center">Abrir Onboarding</a>
        </div>
      </div>
    </div>
  );
}


