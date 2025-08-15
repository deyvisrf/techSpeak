# 🎯 TechSpeak English

**Plataforma de aprendizado de inglês focada em profissionais de tecnologia**

Aprenda inglês técnico através de cenários reais: entrevistas, daily meetings, bug reports, code reviews e apresentações.

## ✨ Principais Funcionalidades

### 🎤 **Coach de Conversação IA**
- Treinamento de fala em tempo real
- Análise de pronúncia, fluência e clareza
- Feedback instantâneo com métricas
- Suporte a Web Speech API (STT/TTS)

### 📚 **Trilhas de Aprendizado**
- **Entrevista Técnica**: Prepare-se para interviews
- **Daily Meeting**: Melhore comunicação em reuniões
- **Bug Report**: Relate problemas técnicos com clareza
- **Code Review**: Discuta código profissionalmente
- **Apresentação Demo**: Apresente projetos com confiança
- **Negociação Salarial**: Negocie com segurança

### 🎯 **Onboarding Inteligente**
- Teste de nível automático (A1-C2)
- Configuração personalizada por cargo (Dev, QA, PM, UI/UX, DevOps)
- Definição de objetivos específicos

### 📊 **Sistema de Progresso**
- Métricas detalhadas de aprendizado
- KPIs de sessões e evolução
- Persistência local + banco de dados
- Dashboard com insights

### 🎨 **Experiência Premium**
- Design moderno inspirado no Pora
- Interface responsiva e acessível
- PWA com suporte offline
- Banner freemium inteligente

## 🚀 Tecnologias

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Design System customizado
- **Banco**: Prisma + SQLite (desenvolvimento)
- **PWA**: Service Worker, Manifest
- **Speech**: Web Speech API (nativo)
- **Build**: ESLint, TypeScript, optimizações de produção

## 📦 Instalação

```bash
# Clone o repositório
git clone [URL_DO_REPOSITORIO]
cd techspeak-english

# Instale dependências
npm install

# Configure o banco de dados
npx prisma generate
npx prisma db push

# Inicie o servidor de desenvolvimento
npm run dev
```

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor dev (localhost:3000)

# Produção
npm run build        # Build otimizado
npm run start        # Servidor de produção

# Banco de dados
npx prisma studio    # Interface visual do banco
npx prisma migrate   # Rodar migrações

# Qualidade
npm run lint         # Verificar código
npm run type-check   # Verificar tipos TypeScript
```

## 🏗️ Estrutura do Projeto

```
web/
├── src/
│   ├── app/                    # App Router (Next.js 15)
│   │   ├── coach/             # Coach de conversação
│   │   ├── dashboard/         # Dashboard principal
│   │   ├── onboarding/        # Fluxo de cadastro
│   │   ├── tracks/            # Trilhas de aprendizado
│   │   └── globals.css        # Estilos globais
│   ├── components/ui/         # Componentes reutilizáveis
│   │   ├── Button.tsx         # Sistema de botões
│   │   ├── Card.tsx           # Cards padronizados
│   │   └── Input.tsx          # Inputs do formulário
│   └── lib/                   # Utilitários e lógica
│       ├── dal/               # Data Access Layer
│       ├── tracks/            # Sistema de trilhas
│       └── kpi.ts             # Métricas e analytics
├── prisma/                    # Configuração do banco
├── public/                    # Assets estáticos + PWA
└── package.json
```

## 🌟 Funcionalidades Técnicas

### **Persistência Híbrida**
- LocalStorage para cache rápido
- Prisma + SQLite para dados estruturados
- Migração automática entre storages

### **Coach de IA Avançado**
- Detecção de volume em tempo real
- Análise contextual por cenário
- Métricas de latência e qualidade
- Feedback personalizado

### **PWA Completa**
- Instalável em dispositivos
- Funciona offline
- Cache inteligente
- Notificações (futuro)

### **Sistema de Telemetria**
- Eventos instrumentados
- KPIs de engagement
- Métricas de performance
- Dashboard de analytics

## 🎯 Roadmap

### **Fase Atual: MVP Completo** ✅
- [x] Todas as funcionalidades core implementadas
- [x] Interface polida e responsiva
- [x] Sistema de persistência robusto
- [x] PWA com service worker

### **Próximas Funcionalidades**
- [ ] IA conversacional real (integração OpenAI/Anthropic)
- [ ] Sistema de pontuação gamificado
- [ ] Certificados de conclusão
- [ ] Modo multiplayer para practice
- [ ] Integração com calendário para lembretes

## 📱 Compatibilidade

- **Browsers**: Chrome 90+, Firefox 90+, Safari 14+, Edge 90+
- **Dispositivos**: Desktop, tablet, mobile
- **PWA**: Instalável em iOS/Android
- **Offline**: Funcionalidades básicas disponíveis

## 🔧 Configuração de Produção

### **Variáveis de Ambiente**
```env
# Database
DATABASE_URL="file:./dev.db"

# Analytics (opcional)
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"

# Feature Flags (opcional)
NEXT_PUBLIC_ENABLE_AI_COACH="true"
```

### **Deploy no Vercel**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 👥 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'feat: adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🎯 Meta do Projeto

Democratizar o aprendizado de inglês técnico, capacitando profissionais brasileiros de tecnologia a se comunicarem com confiança em ambientes internacionais.

---

**Desenvolvido com ❤️ para a comunidade tech brasileira**