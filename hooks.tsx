
import { useState, useEffect, useCallback } from 'react';
import { UserProgress, Exercise } from './types';

const LOCAL_STORAGE_KEY = 'mathAppUserProgress';

const initialProgress: UserProgress = {
  completedLessons: [],
  exerciseAttempts: {},
  quizScores: {},
};

export function useUserProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const storedProgress = localStorage.getItem(LOCAL_STORAGE_KEY);
      return storedProgress ? JSON.parse(storedProgress) : initialProgress;
    } catch (error) {
      console.error("Error loading progress from localStorage:", error);
      return initialProgress;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error("Error saving progress to localStorage:", error);
    }
  }, [progress]);

  const markLessonCompleted = useCallback((lessonId: string) => {
    setProgress(prev => ({
      ...prev,
      completedLessons: [...new Set([...prev.completedLessons, lessonId])],
    }));
  }, []);

  const recordExerciseAttempt = useCallback((exercise: Exercise, isCorrect: boolean) => {
    setProgress(prev => ({
      ...prev,
      exerciseAttempts: {
        ...prev.exerciseAttempts,
        [exercise.id]: {
          attempts: (prev.exerciseAttempts[exercise.id]?.attempts || 0) + 1,
          correct: isCorrect,
        },
      },
    }));
  }, []);
  
  const recordQuizScore = useCallback((chapterId: string, score: number, totalQuestions: number, correctAnswers: number) => {
    setProgress(prev => ({
        ...prev,
        quizScores: {
            ...prev.quizScores,
            [chapterId]: {
                score,
                totalQuestions,
                correctAnswers,
                dateTaken: new Date().toISOString(),
            }
        }
    }));
  }, []);

  const getLessonStatus = useCallback((lessonId: string) => {
    return progress.completedLessons.includes(lessonId);
  }, [progress.completedLessons]);

  const getExerciseStatus = useCallback((exerciseId: string) => {
    return progress.exerciseAttempts[exerciseId];
  }, [progress.exerciseAttempts]);

  const resetProgress = useCallback(() => {
    setProgress(initialProgress);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }, []);

  return {
    progress,
    markLessonCompleted,
    recordExerciseAttempt,
    recordQuizScore,
    getLessonStatus,
    getExerciseStatus,
    resetProgress,
  };
}
