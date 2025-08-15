import { Track } from "./types";

export const tracks: Track[] = [
  {
    slug: "interview",
    title: "Entrevista de Emprego",
    description: "Prepare respostas e pratique com simulações de entrevista.",
    lessons: [
      { id: "i1", order: 1, title: "Estrutura de resposta STAR", type: "THEORY", content: "Aprenda a responder usando Situação, Tarefa, Ação e Resultado." },
      { id: "i2", order: 2, title: "Perguntas comuns", type: "QUIZ", content: "Identifique a melhor resposta.", options: [
        "I don't remember much about the project.",
        "I led the refactor of our CI pipeline, reducing build time by 40%.",
        "It was fine.",
      ], correctIndex: 1 },
      { id: "i3", order: 3, title: "Role-Play: Tell me about a challenging project", type: "ROLEPLAY", scenario: "INTERVIEW" },
    ],
  },
  {
    slug: "daily",
    title: "Daily Scrum",
    description: "Comunique progresso e blockers com clareza.",
    lessons: [
      { id: "d1", order: 1, title: "Estrutura do update diário", type: "THEORY", content: "Ontem / Hoje / Blockers." },
      { id: "d2", order: 2, title: "Exemplos efetivos", type: "QUIZ", content: "Escolha o update mais conciso.", options: [
        "Yesterday: worked. Today: work more. Blockers: none.",
        "Yesterday I implemented the login form; Today I will hook it to the API; Blocker: waiting for backend route.",
        "All good.",
      ], correctIndex: 1 },
      { id: "d3", order: 3, title: "Role-Play: Daily Update", type: "ROLEPLAY", scenario: "DAILY" },
    ],
  },
  {
    slug: "bug-report",
    title: "Reportando um Bug",
    description: "Descreva problemas, passos de reprodução e impacto.",
    lessons: [
      { id: "b1", order: 1, title: "Template de bug report", type: "THEORY", content: "Título, ambiente, passos, esperado vs. obtido." },
      { id: "b2", order: 2, title: "Escolha o impacto", type: "QUIZ", content: "Classifique a severidade corretamente.", options: [
        "Low: quebra deploy em produção.",
        "Critical: impede checkout para todos usuários.",
        "Medium: tooltip desalinhado em página interna.",
      ], correctIndex: 1 },
      { id: "b3", order: 3, title: "Role-Play: Reportar bug crítico", type: "ROLEPLAY", scenario: "BUG_REPORT" },
    ],
  },
];


