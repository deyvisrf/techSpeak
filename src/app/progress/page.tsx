"use client";

import { loadMetrics } from "@/lib/metrics";
import { loadProgress } from "@/lib/tracks/storage";
import { tracks } from "@/lib/tracks/mockData";

export default function ProgressPage() {
  const metrics = loadMetrics();
  const progress = loadProgress();

  const totalLessons = tracks.reduce((acc, t) => acc + t.lessons.length, 0);
  const doneLessons = Object.values(progress).reduce((acc, ids) => acc + ids.length, 0);
  const completion = totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0;

  return (
    <div className="min-h-screen px-8 py-12 sm:px-20">
      <h1 className="text-2xl sm:text-3xl font-bold">Progresso</h1>
      <p className="mt-2 text-black/70">Resumo do seu avanço no MVP.</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-black/10 p-5">
          <h3 className="font-semibold">Conclusão de Lições</h3>
          <p className="mt-1 text-sm text-black/70">
            {doneLessons} de {totalLessons} lições concluídas ({completion}%)
          </p>
          <div className="mt-3 h-3 w-full rounded-full bg-black/10 overflow-hidden">
            <div className="h-full bg-black" style={{ width: `${completion}%` }} />
          </div>
        </div>
        <div className="rounded-xl border border-black/10 p-5">
          <h3 className="font-semibold">Sessões no Coach</h3>
          <p className="mt-1 text-sm text-black/70">{metrics.coachSessions} sessões</p>
          {metrics.lastCoachAt && (
            <p className="mt-1 text-xs text-black/60">Última: {new Date(metrics.lastCoachAt).toLocaleString()}</p>
          )}
        </div>
        <div className="rounded-xl border border-black/10 p-5">
          <h3 className="font-semibold">Próximos Passos</h3>
          <p className="mt-1 text-sm text-black/70">Continue uma trilha ou inicie o Coach a partir do Dashboard.</p>
        </div>
      </div>
    </div>
  );
}


