// Data Access Layer (MVP): abstrai acesso a dados para facilitar migração ao Supabase.
import { PrismaDAL } from "./dal/prismaDAL";

export type UserProfile = {
  role?: string;
  level?: string;
  goals?: string[];
};

export interface DAL {
  getUserProfile(userId: string): Promise<UserProfile | null>;
  saveUserProfile(userId: string, profile: UserProfile): Promise<void>;

  markLessonDone(userId: string | null, trackSlug: string, lessonId: string): Promise<void>;
  listLessonDone(userId: string | null): Promise<Record<string, string[]>>;

  incCoachSession(userId: string | null, scenario?: string, avgLatencyMs?: number): Promise<void>;
}

// Factory: escolhe implementação baseada em env
export function createDAL(): DAL {
  const useDB = process.env.USE_SUPABASE === "true" || process.env.NODE_ENV === "production";
  return useDB ? new PrismaDAL() : new LocalDAL();
}

// Implementação Local (localStorage)
export class LocalDAL implements DAL {
  private profileKey(userId: string) { return `ts.profile.${userId}`; }
  private progressKey(userId: string | null) { return `ts.progress.${userId ?? 'anon'}`; }
  private metricsKey(userId: string | null) { return `ts.metrics.${userId ?? 'anon'}`; }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try { const raw = localStorage.getItem(this.profileKey(userId)); return raw ? JSON.parse(raw) as UserProfile : null; } catch { return null; }
  }
  async saveUserProfile(userId: string, profile: UserProfile): Promise<void> {
    try { localStorage.setItem(this.profileKey(userId), JSON.stringify(profile)); } catch {}
  }
  async markLessonDone(userId: string | null, trackSlug: string, lessonId: string): Promise<void> {
    const key = this.progressKey(userId);
    try {
      const raw = localStorage.getItem(key);
      const map = raw ? (JSON.parse(raw) as Record<string, string[]>) : {};
      const set = new Set(map[trackSlug] ?? []);
      set.add(lessonId);
      map[trackSlug] = Array.from(set);
      localStorage.setItem(key, JSON.stringify(map));
    } catch {}
  }
  async listLessonDone(userId: string | null): Promise<Record<string, string[]>> {
    try { const raw = localStorage.getItem(this.progressKey(userId)); return raw ? JSON.parse(raw) : {}; } catch { return {}; }
  }
  async incCoachSession(userId: string | null, scenario?: string, avgLatencyMs?: number): Promise<void> {
    const key = this.metricsKey(userId);
    try {
      const raw = localStorage.getItem(key);
      const m = raw ? JSON.parse(raw) as Record<string, unknown> : { coachSessions: 0 };
      m.coachSessions = ((m.coachSessions as number) ?? 0) + 1;
      m.lastCoachAt = new Date().toISOString();
      if (scenario) m.lastScenario = scenario;
      if (avgLatencyMs != null) m.lastLatencyMs = avgLatencyMs;
      localStorage.setItem(key, JSON.stringify(m));
    } catch {}
  }
}


