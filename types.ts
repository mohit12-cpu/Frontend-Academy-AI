
export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  codeSnippet: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Flashcard {
  term: string;
  definition: string;
}

export interface GroundingResource {
  title: string;
  uri: string;
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  unlocked: boolean;
  description: string;
}
