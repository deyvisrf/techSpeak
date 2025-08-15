const KEY = "techspeak.metrics";

export type Metrics = {
  coachSessions: number;
  lastCoachAt?: string; // ISO
};

export function loadMetrics(): Metrics {
  if (typeof window === "undefined") return { coachSessions: 0 };
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Metrics) : { coachSessions: 0 };
  } catch {
    return { coachSessions: 0 };
  }
}

export function saveMetrics(m: Metrics) {
  try {
    localStorage.setItem(KEY, JSON.stringify(m));
  } catch {}
}

export function incCoachSession() {
  const m = loadMetrics();
  m.coachSessions = (m.coachSessions ?? 0) + 1;
  m.lastCoachAt = new Date().toISOString();
  saveMetrics(m);
}


