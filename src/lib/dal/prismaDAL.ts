import { prisma } from "../prisma";
import type { DAL, UserProfile } from "../dal";

export class PrismaDAL implements DAL {
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const profile = await prisma.profile.findFirst({
      where: { userId },
    });
    
    if (!profile) return null;
    
    return {
      role: profile.role || undefined,
      level: profile.level || undefined,
      goals: profile.goals?.split(",") || [],
    };
  }

  async saveUserProfile(userId: string, profile: UserProfile): Promise<void> {
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId, email: `${userId}@temp.local` },
    });

    await prisma.profile.upsert({
      where: { userId },
      update: {
        role: profile.role,
        level: profile.level,
        goals: profile.goals?.join(","),
      },
      create: {
        userId,
        role: profile.role,
        level: profile.level,
        goals: profile.goals?.join(","),
      },
    });
  }

  async markLessonDone(userId: string | null, trackSlug: string, lessonId: string): Promise<void> {
    if (!userId) return; // Skip for anonymous users
    
    // Ensure user exists first
    await this.saveUserProfile(userId, { goals: [] });
    
    await prisma.progress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId: `${trackSlug}_${lessonId}`,
        },
      },
      update: { completed: true, completedAt: new Date() },
      create: {
        userId,
        lessonId: `${trackSlug}_${lessonId}`,
        completed: true,
        completedAt: new Date(),
      },
    });
  }

  async listLessonDone(userId: string | null): Promise<Record<string, string[]>> {
    if (!userId) return {};
    
    const progress = await prisma.progress.findMany({
      where: { userId, completed: true },
      select: { lessonId: true },
    });

    const result: Record<string, string[]> = {};
    for (const p of progress) {
      const [trackSlug, lessonId] = p.lessonId.split("_");
      if (!result[trackSlug]) result[trackSlug] = [];
      result[trackSlug].push(lessonId);
    }
    
    return result;
  }

  async incCoachSession(userId: string | null, scenario?: string, avgLatencyMs?: number): Promise<void> {
    if (!userId) return; // Skip for anonymous users
    
    // Ensure user exists first
    await this.saveUserProfile(userId, { goals: [] });
    
    await prisma.coachSession.create({
      data: {
        userId,
        startedAt: new Date(),
        scenario,
        avgLatencyMs,
      },
    });
  }
}
