const KEY = "techspeak.progress";

export type ProgressMap = Record<string, string[]>; // slug -> lesson ids concluídas

export function loadProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

export function saveProgress(progress: ProgressMap) {
  try {
    localStorage.setItem(KEY, JSON.stringify(progress));
  } catch {}
}

export function markDone(slug: string, lessonId: string) {
  const p = loadProgress();
  const list = new Set(p[slug] ?? []);
  list.add(lessonId);
  p[slug] = Array.from(list);
  saveProgress(p);
}

export function isDone(slug: string, lessonId: string) {
  const p = loadProgress();
  return (p[slug] ?? []).includes(lessonId);
}


