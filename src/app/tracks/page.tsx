import Link from "next/link";
import { tracks } from "@/lib/tracks/mockData";

export default function TracksPage() {
  return (
    <div className="min-h-screen px-8 py-12 sm:px-20">
      <h1 className="text-2xl sm:text-3xl font-bold">Trilhas de Aprendizado</h1>
      <p className="mt-2 text-black/70">Escolha um cenário para começar a praticar.</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tracks.map((t) => (
          <Link key={t.slug} className="rounded-xl border border-black/10 p-5 hover:bg-black/5 transition" href={`/tracks/${t.slug}`}>
            <h3 className="font-semibold">{t.title}</h3>
            <p className="mt-1 text-sm text-black/70">{t.description}</p>
            <p className="mt-3 text-xs text-black/50">{t.lessons.length} lições</p>
          </Link>
        ))}
      </div>
    </div>
  );
}


