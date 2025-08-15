import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TechSpeak English",
  description: "Aprendizado de inglês para profissionais de tecnologia: entrevistas, daily meetings e comunicação técnica.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#9333ea" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="border-b border-black/10">
          <nav className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
            <a href="/" className="font-semibold">TechSpeak</a>
            <div className="flex gap-4 text-sm">
              <a href="/onboarding" className="hover:underline">Onboarding</a>
              <a href="/dashboard" className="hover:underline">Dashboard</a>
              <a href="/tracks" className="hover:underline">Trilhas</a>
              <a href="/glossary" className="hover:underline">Glossário</a>
              <a href="/coach" className="hover:underline">Coach</a>
              <a href="/progress" className="hover:underline">Progresso</a>
            </div>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="mt-16">
          {/* Footer com gradiente Pora-inspired suave */}
          <div className="bg-gradient-to-br from-amber-50 via-fuchsia-100 to-purple-200 relative overflow-hidden">
            {/* Gradiente overlay suave */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>
            
            <div className="relative mx-auto max-w-6xl px-6 py-16">
              <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-lg">
                <div className="text-center">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    Pronto para dominar o inglês técnico?
                  </h2>
                  <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
                    Junte-se a milhares de profissionais que já melhoraram sua comunicação através da IA conversacional.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="/onboarding" className="inline-flex items-center justify-center rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors h-12 px-8 font-semibold">
                      Começar Gratuitamente
                    </a>
                    <a href="/tracks" className="inline-flex items-center justify-center rounded-full border border-purple-600 text-purple-600 hover:bg-purple-50 transition-colors h-12 px-8 font-semibold">
                      Ver Trilhas
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer bottom */}
          <div className="border-t border-gray-200 bg-white/80">
            <div className="mx-auto max-w-6xl px-6 py-6">
              <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
                <span>© {new Date().getFullYear()} TechSpeak English. Feito com ❤️ para profissionais de tech.</span>
                <div className="flex gap-6 mt-4 sm:mt-0">
                  <a href="/privacy" className="hover:text-purple-600 transition-colors">Privacidade</a>
                  <a href="/metrics" className="hover:text-purple-600 transition-colors">Métricas</a>
                  <a href="/admin" className="hover:text-purple-600 transition-colors">Status</a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
