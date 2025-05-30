
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Chapter, Lesson, Exercise, ExerciseType, MCQExercise, ExerciseOption } from './types';
import { UI_STRINGS } from './constants';

// Helper to render KaTeX
declare global {
  interface Window {
    renderMathInElement: (element: HTMLElement, options?: object) => void;
  }
}

export const MathText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = text; // Set text first
      if (window.renderMathInElement) {
        try {
            window.renderMathInElement(ref.current, {
              delimiters: [
                {left: "$$", right: "$$", display: true},
                {left: "$", right: "$", display: false},
                {left: "\\(", right: "\\)", display: false},
                {left: "\\[", right: "\\]", display: true}
              ],
              throwOnError: false
            });
        } catch(e) {
            console.error("KaTeX rendering error:", e);
             // Fallback: display raw text if KaTeX fails badly
            if (ref.current) ref.current.innerText = text;
        }
      }
    }
  }, [text]);

  return <div ref={ref} className={className}></div>;
};


export const Button: React.FC<{ onClick?: () => void; children: React.ReactNode; className?: string; type?: "button" | "submit" | "reset"; disabled?: boolean }> = ({ onClick, children, className = '', type = "button", disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-lg font-semibold shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-75
                 bg-sky-600 hover:bg-sky-700 text-white focus:ring-sky-500
                 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed
                 ${className}`}
    >
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => {
  return (
    <div
      className={`bg-white shadow-xl rounded-xl p-6 transition-all duration-300 hover:shadow-2xl ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Mount modal with initial hidden state, then trigger animation
      setShowContent(false); // Ensure it's hidden before timeout
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 20); // Small delay to allow CSS to apply initial state before transition
      return () => clearTimeout(timer);
    } else {
      // Reset for next open, allows animation if modal is rapidly closed/opened
      setShowContent(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className={`bg-white rounded-lg shadow-2xl p-6 w-full max-w-md transform transition-all duration-200 ease-out ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold text-sky-700">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};


export const LoadingDots: React.FC = () => (
  <div className="flex space-x-2 justify-center items-center">
    <span className="sr-only">در حال بارگذاری...</span>
    <div className="h-3 w-3 bg-sky-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="h-3 w-3 bg-sky-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="h-3 w-3 bg-sky-600 rounded-full animate-bounce"></div>
  </div>
);

export const ChapterCard: React.FC<{ chapter: Chapter; progressPercentage: number }> = ({ chapter, progressPercentage }) => {
  let progressColor = 'bg-gray-300';
  let progressText = UI_STRINGS.notStarted;
  if (progressPercentage > 0 && progressPercentage < 100) {
    progressColor = 'bg-yellow-400';
    progressText = UI_STRINGS.partiallyCompleted;
  } else if (progressPercentage === 100) {
    progressColor = 'bg-green-500';
    progressText = UI_STRINGS.completed;
  }

  return (
    <Link to={`/chapter/${chapter.id}`} className="block hover:no-underline">
      <Card className="hover:ring-2 hover:ring-sky-500">
        <div className="flex items-center space-x-4 space-x-reverse">
          {chapter.icon && <div className="text-4xl p-3 bg-sky-100 rounded-full text-sky-600">{chapter.icon}</div>}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-sky-700 mb-1">{chapter.title}</h3>
            <p className="text-gray-600 text-sm mb-3">{chapter.description}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div className={`${progressColor} h-2.5 rounded-full`} style={{ width: `${progressPercentage}%` }}></div>
            </div>
            <p className={`text-xs mt-1 font-medium ${
                progressPercentage === 100 ? 'text-green-600' : 
                progressPercentage > 0 ? 'text-yellow-600' : 'text-gray-500'
            }`}>
                {progressText} ({Math.round(progressPercentage)}%)
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export const LessonItem: React.FC<{ lesson: Lesson; chapterId: string; isCompleted: boolean }> = ({ lesson, chapterId, isCompleted }) => (
  <Link to={`/chapter/${chapterId}/lesson/${lesson.id}`} className="block hover:no-underline">
    <Card className="hover:bg-sky-50 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-semibold text-sky-700">{lesson.title}</h4>
        </div>
        {isCompleted ? (
          <span className="text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">{UI_STRINGS.completed} ✅</span>
        ) : (
          <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{UI_STRINGS.startLesson} ➡️</span>
        )}
      </div>
    </Card>
  </Link>
);

// --- Exercise Components ---
interface ExerciseHostProps {
  exercise: Exercise;
  onAnswer: (isCorrect: boolean, selectedOptionId?: string) => void;
  showSolutionTrigger: boolean; // To trigger showing solution
}

export const ExerciseHost: React.FC<ExerciseHostProps> = ({ exercise, onAnswer, showSolutionTrigger }) => {
  switch (exercise.type) {
    case ExerciseType.MCQ:
      return <MCQExerciseComponent exercise={exercise as MCQExercise} onAnswer={onAnswer} showSolutionTrigger={showSolutionTrigger} />;
    // Add cases for TrueFalseExercise, FillBlankExercise later
    default:
      return <div className="text-red-500">نوع تمرین پشتیبانی نمی‌شود.</div>;
  }
};

const MCQExerciseComponent: React.FC<{ exercise: MCQExercise; onAnswer: (isCorrect: boolean, selectedOptionId: string) => void; showSolutionTrigger: boolean }> = ({ exercise, onAnswer, showSolutionTrigger }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleSubmit = () => {
    if (!selectedOptionId) {
      alert(UI_STRINGS.selectAnswer);
      return;
    }
    const correct = selectedOptionId === exercise.correctAnswerId;
    setIsCorrect(correct);
    setSubmitted(true);
    onAnswer(correct, selectedOptionId);
  };
  
  useEffect(() => {
    if (showSolutionTrigger && !submitted) {
      // If solution is requested before submission, mark as incorrect attempt
      // Or handle differently based on requirements
      setIsCorrect(false);
      setSubmitted(true);
      // Potentially call onAnswer(false, undefined) if it's an attempt
    }
  }, [showSolutionTrigger, submitted, onAnswer]);

  const getOptionClass = (option: ExerciseOption) => {
    let baseClass = "block w-full text-right p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:bg-sky-50";
    if (!submitted && selectedOptionId === option.id) {
      return `${baseClass} bg-sky-100 border-sky-500 ring-2 ring-sky-500`;
    }
    if (submitted) {
      if (option.id === exercise.correctAnswerId) {
        return `${baseClass} bg-green-100 border-green-500 text-green-700 cursor-not-allowed`;
      }
      if (option.id === selectedOptionId && option.id !== exercise.correctAnswerId) {
        return `${baseClass} bg-red-100 border-red-500 text-red-700 cursor-not-allowed`;
      }
      return `${baseClass} bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed`;
    }
    return `${baseClass} border-gray-300`;
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <MathText text={exercise.question} className="text-lg font-semibold mb-6" />
      <div className="space-y-3 mb-6">
        {exercise.options.map((option) => (
          <label key={option.id} className={getOptionClass(option)}>
            <input
              type="radio"
              name={exercise.id}
              value={option.id}
              checked={selectedOptionId === option.id}
              onChange={() => !submitted && setSelectedOptionId(option.id)}
              className="sr-only" // Hide actual radio, style label
              disabled={submitted}
            />
            <MathText text={option.text} />
          </label>
        ))}
      </div>
      {!submitted && (
        <Button onClick={handleSubmit} disabled={!selectedOptionId}>
          {UI_STRINGS.submit}
        </Button>
      )}
      { (submitted || showSolutionTrigger) && exercise.explanation && (
        <div className={`mt-4 p-4 rounded-lg ${isCorrect === true ? 'bg-green-50 text-green-700' : isCorrect === false ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
          <h4 className="font-semibold mb-2">{isCorrect === true ? UI_STRINGS.correct : isCorrect === false ? UI_STRINGS.incorrect : UI_STRINGS.solution}</h4>
          <MathText text={exercise.explanation} />
          {isCorrect === false && selectedOptionId && (
            <p className="mt-2">{UI_STRINGS.yourAnswer} <MathText text={exercise.options.find(o => o.id === selectedOptionId)?.text || ''} /></p>
          )}
        </div>
      )}
    </div>
  );
};
