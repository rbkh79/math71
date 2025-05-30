
export enum ExerciseType {
  MCQ = 'MCQ', // Multiple Choice Question
  TRUE_FALSE = 'TRUE_FALSE',
  FILL_BLANK = 'FILL_BLANK',
}

export interface ExerciseOption {
  id: string;
  text: string;
}

export interface BaseExercise {
  id: string;
  question: string; // Can contain KaTeX
  type: ExerciseType;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation?: string; // Explanation for the correct answer, can contain KaTeX
}

export interface MCQExercise extends BaseExercise {
  type: ExerciseType.MCQ;
  options: ExerciseOption[];
  correctAnswerId: string; // ID of the correct option
}

export interface TrueFalseExercise extends BaseExercise {
  type: ExerciseType.TRUE_FALSE;
  correctAnswer: boolean;
}

export interface FillBlankExercise extends BaseExercise {
  type: ExerciseType.FILL_BLANK;
  correctAnswer: string; // Can be a number or short text
}

export type Exercise = MCQExercise | TrueFalseExercise | FillBlankExercise;

export interface SolvedExample {
  id: string;
  problem: string; // Can contain KaTeX
  solutionSteps: string[]; // Each step can contain KaTeX
}

export interface Lesson {
  id: string;
  title: string;
  content: string; // Main lesson content, can contain KaTeX
  solvedExamples: SolvedExample[];
  exercises: Exercise[];
  videoUrl?: string; // Optional video URL
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  icon?: string; // e.g., SVG path or emoji
}

export interface UserProgress {
  completedLessons: string[]; // lesson IDs
  exerciseAttempts: {
    [exerciseId: string]: {
      attempts: number;
      correct: boolean | null; // null if not attempted, true if last attempt correct, false otherwise
    };
  };
  quizScores: {
    [chapterId: string]: {
      score: number; // Percentage
      totalQuestions: number;
      correctAnswers: number;
      dateTaken: string;
    };
  };
}

export interface Quiz {
    id: string;
    chapterId: string;
    title: string;
    questions: Exercise[]; // Re-use exercise type for quiz questions
}
