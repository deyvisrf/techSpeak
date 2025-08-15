"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { incCoachSession } from "@/lib/metrics";
import { logKPI } from "@/lib/kpi";

type Scenario =
  | "INTERVIEW"
  | "DAILY"
  | "BUG_REPORT"
  | "CODE_REVIEW"
  | "PRESENT_DEMO"
  | "NEGOTIATE_SALARY";

function useQueryScenario(): Scenario | null {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const value = url.searchParams.get("scenario");
      if (!value) return;
      setScenario(value as Scenario);
    } catch {
      setScenario(null);
    }
  }, []);
  return scenario;
}

export default function CoachClient() {
  const scenario = useQueryScenario();
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(0); // 0..1
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);

  // Web Speech API (STT) — stub sem IA
  const recognitionRef = useRef<any>(null);
  const [sttSupported, setSttSupported] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const sttLastTurnAtRef = useRef<number>(0);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSttSupported(true);
      const rec = new SpeechRecognition();
      rec.lang = "en-US"; // foco no inglês
      rec.interimResults = true;
      rec.continuous = true;
      rec.onresult = (event: any) => {
        let finalText = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) finalText += res[0].transcript;
        }
        if (finalText) {
          setTranscript((prev) => (prev ? prev + " " : "") + finalText.trim());
          // simular resposta da IA e medir latência
          const now = performance.now();
          const latency = sttLastTurnAtRef.current ? Math.round(now - sttLastTurnAtRef.current) : null;
          if (latency !== null) setLatencyMs(latency);
          sttLastTurnAtRef.current = now;
          const response = `Good! Try to speak slower and emphasize key terms: "${finalText.trim()}"`;
          setAiResponse(response);
          if (ttsEnabled && "speechSynthesis" in window) {
            try {
              const utter = new SpeechSynthesisUtterance(response);
              utter.lang = "en-US";
              window.speechSynthesis.cancel();
              window.speechSynthesis.speak(utter);
            } catch {}
          }
        }
      };
      rec.onerror = () => {};
      rec.onend = () => {
        // se ainda gravando, reinicia para manter contínuo
        if (isRecording) rec.start();
      };
      recognitionRef.current = rec;
    }
  }, [isRecording]);

  const start = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.fftSize);
      const loop = () => {
        analyser.getByteTimeDomainData(dataArray);
        // RMS
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const v = (dataArray[i] - 128) / 128; // -1..1
          sum += v * v;
        }
        const rms = Math.sqrt(sum / dataArray.length); // 0..1
        setVolume(rms);
        rafRef.current = requestAnimationFrame(loop);
      };
      loop();
      setIsRecording(true);
      logKPI("COACH_SESSION_START", { scenario });
      // iniciar STT se disponível
      if (recognitionRef.current) {
        sttLastTurnAtRef.current = performance.now();
        try {
          recognitionRef.current.start();
        } catch {}
      }
    } catch (err) {
      setError("Falha ao acessar microfone. Verifique permissões.");
      stop();
    }
  }, []);

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (analyserRef.current) analyserRef.current.disconnect();
    analyserRef.current = null;
    if (audioCtxRef.current) audioCtxRef.current.close().catch(() => {});
    audioCtxRef.current = null;
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    // parar STT
    try { recognitionRef.current && recognitionRef.current.stop(); } catch {}
    setIsRecording(false);
    setVolume(0);
    // contabiliza sessão se houve captura iniciada
    incCoachSession();
    logKPI("COACH_SESSION_END", { scenario, latencyMs });
  }, []);

  useEffect(() => () => stop(), [stop]);

  const meterWidth = useMemo(() => `${Math.min(100, Math.max(0, Math.round(volume * 100)))}%`, [volume]);

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-col sm:flex-row">
        <div>
          <p className="text-sm text-black/70">
            {scenario ? `Cenário: ${scenario}` : "Selecione um cenário no Dashboard ou Trilhas."}
          </p>
        </div>
        <div className="flex gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={ttsEnabled} onChange={(e) => setTtsEnabled(e.target.checked)} />
            TTS
          </label>
          {!isRecording ? (
            <button onClick={start} className="h-10 px-4 rounded-full border border-black/10 bg-black text-white">Iniciar Sessão</button>
          ) : (
            <button onClick={stop} className="h-10 px-4 rounded-full border border-black/10 hover:bg-black/5">Parar</button>
          )}
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-6">
        <label className="block text-sm font-medium">Nível de áudio</label>
        <div className="mt-2 h-3 w-full rounded-full bg-black/10 overflow-hidden">
          <div className="h-full bg-black" style={{ width: meterWidth }} />
        </div>
        <p className="mt-1 text-xs text-black/60">Fale para ver o medidor responder.</p>
      </div>

      <div className="mt-6 rounded-xl border border-black/10 p-4">
        <h3 className="font-semibold">Transcrição (STT)</h3>
        {!sttSupported && (
          <p className="mt-2 text-sm text-black/70">Seu navegador não suporta Web Speech API. A transcrição será adicionada com IA no futuro.</p>
        )}
        {sttSupported && (
          <>
            <p className="mt-2 text-sm text-black/70 whitespace-pre-wrap">{transcript || "(sem transcrição ainda)"}</p>
            {aiResponse && <p className="mt-2 text-sm">Resposta (stub): {aiResponse}</p>}
            {latencyMs !== null && (
              <p className="mt-1 text-xs text-black/60">Latência simulada: ~{latencyMs} ms</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}


