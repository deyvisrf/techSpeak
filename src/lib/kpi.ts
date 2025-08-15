export type KPIEventType =
  | "IA_RESPONSE"
  | "COACH_SESSION_START"
  | "COACH_SESSION_END"
  | "LESSON_COMPLETED"
  | "QUIZ_SUBMITTED";

export type KPIEvent = {
  id: string;
  type: KPIEventType;
  createdAt: string; // ISO
  payload?: Record<string, unknown>;
};

const KEY = "techspeak.kpi";

export function logKPI(type: KPIEventType, payload?: Record<string, unknown>) {
  try {
    const raw = localStorage.getItem(KEY);
    const list: KPIEvent[] = raw ? JSON.parse(raw) : [];
    list.push({ id: crypto.randomUUID(), type, createdAt: new Date().toISOString(), payload });
    localStorage.setItem(KEY, JSON.stringify(list.slice(-500))); // limita histórico
  } catch {}
}

export function readKPI(): KPIEvent[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as KPIEvent[]) : [];
  } catch {
    return [];
  }
}


