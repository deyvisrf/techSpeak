import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

// Mock data - replace with real KPI calculations
const mockMetrics = {
  totalUsers: 1247,
  activeUsers: 523,
  d7Retention: 68,
  d30Retention: 42,
  avgSessionTime: 12.5,
  completionRate: 78,
  coachSessions: 3421,
  lessonsCompleted: 8934,
};

export default function MetricsPage() {
  return (
    <div className="min-h-screen px-8 py-12 sm:px-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard de Métricas</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Usuários Totais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockMetrics.totalUsers.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Usuários Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockMetrics.activeUsers.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Retenção D7</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockMetrics.d7Retention}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Retenção D30</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockMetrics.d30Retention}%</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Engajamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tempo médio de sessão</span>
                  <span className="font-semibold">{mockMetrics.avgSessionTime} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxa de conclusão</span>
                  <span className="font-semibold">{mockMetrics.completionRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sessões do Coach</span>
                  <span className="font-semibold">{mockMetrics.coachSessions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lições completadas</span>
                  <span className="font-semibold">{mockMetrics.lessonsCompleted.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trilhas Populares</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Interview Practice</span>
                  <span className="font-semibold">42%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: "42%" }}></div>
                </div>
                
                <div className="flex justify-between">
                  <span>Daily Meetings</span>
                  <span className="font-semibold">35%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: "35%" }}></div>
                </div>
                
                <div className="flex justify-between">
                  <span>Bug Reporting</span>
                  <span className="font-semibold">23%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: "23%" }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>KPI Events (Últimas 24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600">
              <p>• 127 novas sessões do Coach iniciadas</p>
              <p>• 89 lições completadas</p>
              <p>• 45 novos usuários onboarded</p>
              <p>• 234 eventos de quiz submetidos</p>
              <p>• Latência média do Coach: 1.2s</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
