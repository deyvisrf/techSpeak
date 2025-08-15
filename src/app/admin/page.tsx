import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function AdminPage() {
  const completedTasks = [
    "✅ Prisma + SQLite configurado e migrado",
    "✅ PrismaDAL implementado com fallback para LocalDAL",
    "✅ Sistema de componentes UI (Button, Card, Input)",
    "✅ Coach com STT + TTS em tempo real",
    "✅ Política de privacidade completa",
    "✅ Dashboard de métricas/KPIs",
    "✅ Build TypeScript limpo (99.7kB shared JS)",
    "✅ PWA básico configurado",
  ];

  const pendingTasks = [
    "🟡 Testes unitários/E2E",
    "🟡 Deploy Vercel + CI/CD",
    "🟡 Service Worker offline",
    "🟡 Mobile app planning",
  ];

  return (
    <div className="min-h-screen px-8 py-12 sm:px-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🎉 TechSpeak MVP Completo!</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">✅ Implementado</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {completedTasks.map((task, i) => (
                  <li key={i} className="text-sm">{task}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-orange-600">🟡 Próximos Passos</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {pendingTasks.map((task, i) => (
                  <li key={i} className="text-sm">{task}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>🚀 Status do Plano</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Core MVP Features:</h4>
                <p className="text-sm text-gray-600 mb-4">
                  ✅ F1 Onboarding | ✅ F2 Learning Paths | ✅ F3 Interactive Lessons | ✅ F4 AI Coach | ✅ F5 Progress
                </p>
                
                <h4 className="font-semibold mb-2">Tech Stack:</h4>
                <p className="text-sm text-gray-600">
                  Next.js 15 + TypeScript + Tailwind + Prisma + SQLite + Web Speech API
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Deployment Ready:</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Build limpo, tipos corretos, componentes padronizados, Pora-inspired design
                </p>
                
                <h4 className="font-semibold mb-2">Dev URL:</h4>
                <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                  http://localhost:3000
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link href="/dashboard">
            <Button>Dashboard</Button>
          </Link>
          <Link href="/tracks">
            <Button variant="outline">Trilhas</Button>
          </Link>
          <Link href="/coach">
            <Button variant="outline">Coach</Button>
          </Link>
          <Link href="/metrics">
            <Button variant="outline">Métricas</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
