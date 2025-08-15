import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen px-8 py-12 sm:px-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Política de Privacidade</h1>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Coleta de Dados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                O TechSpeak English coleta apenas os dados necessários para fornecer uma experiência de aprendizado personalizada:
              </p>
              <ul className="mt-4 space-y-2 text-gray-600">
                <li>• Perfil de usuário (nível, objetivos)</li>
                <li>• Progresso nas lições</li>
                <li>• Dados de sessões do Coach (apenas métricas)</li>
                <li>• Áudio das conversações (processado localmente quando possível)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Uso dos Dados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Seus dados são utilizados exclusivamente para:
              </p>
              <ul className="mt-4 space-y-2 text-gray-600">
                <li>• Personalizar seu plano de aprendizado</li>
                <li>• Fornecer feedback do Coach IA</li>
                <li>• Acompanhar seu progresso</li>
                <li>• Melhorar nossa plataforma</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dados de Áudio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                O áudio das sessões do Coach é processado para análise de pronúncia e feedback. Por padrão:
              </p>
              <ul className="mt-4 space-y-2 text-gray-600">
                <li>• Processamento local sempre que possível</li>
                <li>• Dados não são armazenados permanentemente</li>
                <li>• Você pode optar por não usar recursos de áudio</li>
                <li>• Consentimento explícito para análise avançada</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Seus Direitos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Você tem total controle sobre seus dados:
              </p>
              <ul className="mt-4 space-y-2 text-gray-600">
                <li>• Acessar todos os dados coletados</li>
                <li>• Corrigir informações incorretas</li>
                <li>• Deletar sua conta e dados</li>
                <li>• Revogar consentimentos a qualquer momento</li>
                <li>• Exportar seus dados em formato legível</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Implementamos medidas de segurança robustas:
              </p>
              <ul className="mt-4 space-y-2 text-gray-600">
                <li>• Criptografia de dados em trânsito e repouso</li>
                <li>• Acesso restrito por funções</li>
                <li>• Auditoria regular de segurança</li>
                <li>• Backup seguro e recuperação</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contato</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Para questões sobre privacidade ou exercer seus direitos:
              </p>
              <p className="mt-2 font-medium">privacy@techspeak.com</p>
              <p className="text-sm text-gray-500 mt-4">
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex justify-center">
          <Link href="/dashboard">
            <Button>Voltar ao Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
