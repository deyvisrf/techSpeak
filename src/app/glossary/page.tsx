"use client";

import { useMemo, useState } from "react";

type Term = {
  id: string;
  term: string;
  ipa?: string;
  definition?: string;
  examples?: string[];
};

const TERMS: Term[] = [
  { id: "t1", term: "deployment", ipa: "/dɪˈplɔɪmənt/", definition: "Processo de publicar software em um ambiente.", examples: ["We scheduled the deployment to staging."] },
  { id: "t2", term: "pull request", ipa: "/pʊl rɪˈkwest/", definition: "Solicitação para mesclar alterações em um repositório.", examples: ["I'll open a pull request for review."] },
  { id: "t3", term: "regression", ipa: "/rɪˈɡreʃ.ən/", definition: "Falha reintroduzida após mudança.", examples: ["This is a regression from last release."] },
];

const FAV_KEY = "techspeak.favorites";

function useFavorites() {
  const [ids, setIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(FAV_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });
  const save = (next: string[]) => {
    setIds(next);
    try { localStorage.setItem(FAV_KEY, JSON.stringify(next)); } catch {}
  };
  const toggle = (id: string) => {
    const s = new Set(ids);
    s.has(id) ? s.delete(id) : s.add(id);
    save(Array.from(s));
  };
  return { ids, toggle };
}

export default function GlossaryPage() {
  const [q, setQ] = useState("");
  const { ids, toggle } = useFavorites();
  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return TERMS.filter(t => t.term.toLowerCase().includes(needle));
  }, [q]);

  return (
    <div className="min-h-screen px-8 py-12 sm:px-20">
      <h1 className="text-2xl sm:text-3xl font-bold">Glossário</h1>
      <p className="mt-2 text-black/70">Termos essenciais com pronúncia e exemplos.</p>

      <div className="mt-6">
        <input
          placeholder="Buscar termos (ex.: PR, deploy)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full h-11 rounded border border-black/10 px-4"
        />
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((t) => (
          <div key={t.id} className="rounded-xl border border-black/10 p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{t.term}</h3>
                {t.ipa && <p className="text-xs text-black/60">{t.ipa}</p>}
              </div>
              <button onClick={() => toggle(t.id)} className="h-8 px-3 rounded-full border border-black/10 hover:bg-black/5 text-sm">
                {ids.includes(t.id) ? "★ Favorito" : "☆ Favoritar"}
              </button>
            </div>
            {t.definition && <p className="mt-2 text-sm text-black/70">{t.definition}</p>}
            {t.examples && t.examples.length > 0 && (
              <ul className="mt-2 list-disc list-inside text-sm text-black/70">
                {t.examples.map((ex, i) => (<li key={i}>{ex}</li>))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


