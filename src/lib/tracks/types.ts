export type LessonType = "THEORY" | "QUIZ" | "ROLEPLAY";

export type ScenarioType =
  | "INTERVIEW"
  | "DAILY"
  | "BUG_REPORT"
  | "CODE_REVIEW"
  | "PRESENT_DEMO"
  | "NEGOTIATE_SALARY";

export type Lesson = {
  id: string;
  order: number;
  title: string;
  type: LessonType;
  content?: string;
  scenario?: ScenarioType; // usado quando type = ROLEPLAY
  // Quiz (opcional)
  options?: string[];
  correctIndex?: number; // índice em options
};

export type Track = {
  slug: string; // "interview"
  title: string;
  description?: string;
  lessons: Lesson[];
};


