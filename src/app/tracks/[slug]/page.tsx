import { notFound } from "next/navigation";
import { tracks } from "@/lib/tracks/mockData";
import Link from "next/link";
import { isDone } from "@/lib/tracks/storage";
import { use } from "react";

type Props = { params: Promise<{ slug: string }> };

export default function TrackDetail({ params }: Props) {
  const { slug } = use(params);
  const track = tracks.find((t) => t.slug === slug);
  if (!track) return notFound();

  return (
    <div className="min-h-screen px-8 py-12 sm:px-20">
      <h1 className="text-2xl sm:text-3xl font-bold">{track.title}</h1>
      <p className="mt-2 text-black/70">{track.description}</p>

      <div className="mt-8 grid gap-6">
        {track.lessons
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((lesson) => {
            const done = typeof window !== "undefined" && isDone(track.slug, lesson.id);
            return (
              <Link
                key={lesson.id}
                href={`/tracks/${track.slug}/lesson/${lesson.id}`}
                className="rounded-xl border border-black/10 p-5 hover:bg-black/5 transition block"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{lesson.order}. {lesson.title}</h3>
                    <p className="mt-1 text-sm text-black/70">Tipo: {lesson.type}</p>
                  </div>
                  {done && <span className="text-sm text-green-700">Concluída ✓</span>}
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}


