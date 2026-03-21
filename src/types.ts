export interface KC {
  id: string;
  title: string;
  description: string;
  pL0: number;
  pT: number;
  pG: number;
  pS: number;
}

export interface LearnerState {
  mastery: Record<string, number>; // KC_ID -> probability
  completedTopics: string[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  difficulty: 'easy' | 'medium' | 'hard';
  hint: string;
}

export interface ContentSection {
  id: string;
  title: string;
  videoUrl: string;
  explanation: string;
  examples: string[];
  questions: Question[];
  remedialContent?: {
    explanation: string;
    videoUrl: string;
  };
}
