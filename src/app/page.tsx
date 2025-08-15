import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen px-6 sm:px-8 py-12 sm:py-16">
      <main className="mx-auto max-w-6xl">
        <section className="rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-amber-100 via-fuchsia-200 to-purple-200">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">TechSpeak English</h1>
          <p className="mt-4 text-base sm:text-lg text-black/70 max-w-3xl">
            Aprendizado de inglês para profissionais de tecnologia, com foco em entrevistas, daily meetings e comunicação técnica.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="rounded-full">
                Ir para o Dashboard
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="rounded-full">
              Ver recursos do MVP
            </Button>
          </div>
        </section>

        <section id="features" className="mt-16 grid sm:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Trilhas de Aprendizado</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Cenários: Entrevista, Daily, Bug Report.</CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Coach de Conversação</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Feedback em tempo real de pronúncia e entonação.</CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Progresso</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Acompanhe evolução por habilidade.</CardDescription>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
