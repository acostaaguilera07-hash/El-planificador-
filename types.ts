
export enum Grade {
  FIRST = '1° Grado',
  SECOND = '2° Grado',
  THIRD = '3° Grado',
  FOURTH = '4° Grado',
  FIFTH = '5° Grado',
}

export enum Subject {
  MATH = 'Matemáticas',
  LANGUAGE = 'Lenguaje',
  SCIENCE = 'Ciencias Naturales',
  SOCIAL = 'Ciencias Sociales',
  ARTS = 'Educación Artística',
  RELIGION = 'Religión',
  PHYSICAL_ED = 'Educación Física',
  ETHICS = 'Ética y Valores',
  ENGLISH = 'Inglés',
}

export enum Difficulty {
  EASY = 'Fácil',
  MEDIUM = 'Intermedio',
  HARD = 'Avanzado',
}

export interface QuizQuestion {
  context?: string; // The situation/text/scenario (ICFES style)
  imagePrompt?: string; // Description for the AI image generator
  competency?: string; // The skill being tested (Argumentation, etc.)
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface QuizResult {
  id: string;
  date: string;
  grade: Grade;
  subject: Subject;
  topic: string;
  score: number; // Percentage
  totalQuestions: number;
  correctAnswers: number;
  difficulty: Difficulty;
}

export interface UserProfile {
  name: string;
  avatar: string;
  xp: number;
  level: number;
  history: QuizResult[];
}

export type ViewState = 
  | 'HOME' 
  | 'ABOUT'
  | 'GRADE_SELECT'
  | 'SUBJECT_SELECT' 
  | 'TOPIC_SELECT' 
  | 'THEORY' 
  | 'QUIZ' 
  | 'PROFILE';
