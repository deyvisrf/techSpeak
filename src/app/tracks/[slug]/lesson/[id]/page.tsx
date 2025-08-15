"use client";

import React, { useEffect, useMemo, useState } from "react";
import { tracks } from "@/lib/tracks/mockData";
import { markDone } from "@/lib/tracks/storage";
import Link from "next/link";
import { logKPI } from "@/lib/kpi";

type Props = { params: Promise<{ slug: string; id: string }> };

export default function LessonPage({ params }: Props) {
  // In client components we can't await params. Read from URL instead to avoid the async warning.
  const url = new URL(globalThis.location.href);
  const slug = url.pathname.split("/")[2];
  const id = url.pathname.split("/")[4];
  const track = tracks.find((t) => t.slug === slug);
  const lesson = track?.lessons.find((l) => l.id === id);

  useEffect(() => {
    if (track && lesson) markDone(track.slug, lesson.id);
  }, [track, lesson]);

  const coachHref = useMemo(() => {
    if (!lesson || lesson.type !== "ROLEPLAY" || !lesson.scenario) return null;
    const query = new URLSearchParams({ scenario: lesson.scenario }).toString();
    return `/coach?${query}`;
  }, [lesson]);

  if (!track || !lesson) return (
    <div className="min-h-screen px-8 py-12 sm:px-20">Lição não encontrada.</div>
  );

  return (
    <div className="min-h-screen px-8 py-12 sm:px-20">
      <h1 className="text-2xl sm:text-3xl font-bold">{track.title}</h1>
      <p className="mt-2 text-black/70">{lesson.order}. {lesson.title}</p>

      <div className="mt-6 rounded-xl border border-black/10 p-5">
        {lesson.type === "THEORY" && (
          <article className="prose">
            <p>{lesson.content}</p>
          </article>
        )}
        {lesson.type === "QUIZ" && (
          <Quiz
            question={lesson.content ?? ""}
            options={lesson.options ?? []}
            correctIndex={lesson.correctIndex ?? 0}
            onComplete={() => { markDone(track.slug, lesson.id); logKPI("LESSON_COMPLETED", { track: track.slug, lesson: lesson.id }); }}
            onSubmit={(ok) => logKPI("QUIZ_SUBMITTED", { track: track.slug, lesson: lesson.id, ok })}
          />
        )}
        {lesson.type === "ROLEPLAY" && (
          <div>
            <p className="text-sm text-black/70">Role-play com cenário: {lesson.scenario}. Use o Coach para praticar em voz.</p>
            {coachHref && (
              <a href={coachHref} className="mt-4 inline-flex items-center justify-center rounded-full border border-black/10 bg-black text-white h-10 px-4">
                Abrir Coach com este cenário
              </a>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Link href={`/tracks/${track.slug}`} className="h-10 px-4 rounded-full border border-black/10 hover:bg-black/5">Voltar para a trilha</Link>
      </div>
    </div>
  );
}

function Quiz({ question, options, correctIndex, onComplete, onSubmit }: { question: string; options: string[]; correctIndex: number; onComplete: () => void; onSubmit: (ok: boolean) => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<"" | "ok" | "fail">("");

  const submit = () => {
    if (selected === null) return;
    const ok = selected === correctIndex;
    setResult(ok ? "ok" : "fail");
    onSubmit(ok);
    if (ok) onComplete();
  };

  return (
    <div>
      <p className="font-medium">{question}</p>
      <div className="mt-3 grid gap-2">
        {options.map((opt, idx) => (
          <label key={idx} className="flex items-center gap-2 rounded-xl border border-black/10 p-3 hover:bg-black/5">
            <input type="radio" name="quiz" checked={selected === idx} onChange={() => setSelected(idx)} />
            <span className="text-sm">{opt}</span>
          </label>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button onClick={submit} className="h-10 px-4 rounded-full border border-black/10 bg-black text-white">Enviar</button>
        {result === "ok" && <span className="text-sm text-green-700">Correto! Marcado como concluído.</span>}
        {result === "fail" && <span className="text-sm text-red-600">Resposta incorreta. Tente novamente.</span>}
      </div>
    </div>
  );
}


