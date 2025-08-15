import { PrismaClient } from "@prisma/client";
import { tracks as MOCK_TRACKS } from "../src/lib/tracks/mockData";

const prisma = new PrismaClient();

async function main() {
  // Seed tracks and lessons
  for (const t of MOCK_TRACKS) {
    const track = await prisma.track.upsert({
      where: { slug: t.slug },
      update: { title: t.title, description: t.description },
      create: { slug: t.slug, title: t.title, description: t.description },
    });
    for (const l of t.lessons) {
      await prisma.lesson.upsert({
        where: { id: `${track.id}_${l.id}` },
        update: { order: l.order, title: l.title, type: l.type, content: l.content ?? null, scenario: l.scenario ?? null },
        create: {
          id: `${track.id}_${l.id}`,
          trackId: track.id,
          order: l.order,
          title: l.title,
          type: l.type,
          content: l.content ?? null,
          scenario: l.scenario ?? null,
        },
      });
    }
  }
  console.log("Seed completed.");
}

main().finally(async () => {
  await prisma.$disconnect();
});


