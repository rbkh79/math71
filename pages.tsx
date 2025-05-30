
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Chapter, Lesson, Exercise, SolvedExample, Quiz } from './types';
import { CHAPTERS_DATA, UI_STRINGS, ROUTES, QUIZZES_DATA } from './constants';
import { Button, Card, ChapterCard, LessonItem, LoadingDots, MathText, ExerciseHost, Modal } from './components';
import { useUserProgress } from './hooks';

// Helper function to find content (could be moved to a service file)
const findChapter = (chapterId?: string): Chapter | undefined => CHAPTERS_DATA.find(c => c.id === chapterId);
const findLesson = (chapterId?: string, lessonId?: string): Lesson | undefined => {
  const chapter = findChapter(chapterId);
  return chapter?.lessons.find(l => l.id === lessonId);
};
const findQuiz = (chapterId?: string): Quiz | undefined => QUIZZES_DATA.find(q => q.chapterId === chapterId);


export const HomePage: React.FC = () => {
  const { progress } = useUserProgress();

  const getChapterProgress = (chapter: Chapter) => {
    if (!chapter.lessons || chapter.lessons.length === 0) return 100; // No lessons means chapter is "complete" conceptually
    const completedInChapter = chapter.lessons.filter(l => progress.completedLessons.includes(l.id)).length;
    return (completedInChapter / chapter.lessons.length) * 100;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-sky-700 mb-10">{UI_STRINGS.chapters}</h1>
      {CHAPTERS_DATA.length === 0 ? (
        <p className="text-center text-gray-600 text-xl">{UI_STRINGS.comingSoon}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CHAPTERS_DATA.map(chapter => (
            <ChapterCard key={chapter.id} chapter={chapter} progressPercentage={getChapterProgress(chapter)} />
          ))}
        </div>
      )}
    </div>
  );
};

export const ChapterPage: React.FC = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const chapter = useMemo(() => findChapter(chapterId), [chapterId]);
  const { getLessonStatus } = useUserProgress();
  
  if (!chapter) {
    return <div className="text-center py-10 text-red-500 text-xl">فصل مورد نظر یافت نشد.</div>;
  }

  const quizForChapter = findQuiz(chapterId);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 p-6 bg-gradient-to-br from-sky-600 to-blue-700 rounded-xl shadow-lg text-white">
        <div className="flex items-center space-x-4 space-x-reverse">
          {chapter.icon && <div className="text-5xl opacity-80">{chapter.icon}</div>}
          <div>
            <h1 className="text-4xl font-bold">{chapter.title}</h1>
            <p className="text-lg opacity-90 mt-1">{chapter.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section>
            <h2 className="text-3xl font-semibold text-sky-700 mb-6">{UI_STRINGS.lessons}</h2>
            {chapter.lessons.length > 0 ? (
                <div className="space-y-4">
                {chapter.lessons.map(lesson => (
                    <LessonItem key={lesson.id} lesson={lesson} chapterId={chapter.id} isCompleted={getLessonStatus(lesson.id)} />
                ))}
                </div>
            ) : (
                <p className="text-gray-600">{UI_STRINGS.noLessons}</p>
            )}
        </section>
        
        {quizForChapter && (
            <section className="md:mt-0 mt-8">
                <h2 className="text-3xl font-semibold text-sky-700 mb-6">{UI_STRINGS.quiz}</h2>
                <Card className="bg-sky-50">
                    <h3 className="text-xl font-bold text-sky-800 mb-3">{quizForChapter.title}</h3>
                    <p className="text-gray-700 mb-4">دانش خود را در این فصل بسنجید.</p>
                    <Link to={ROUTES.QUIZ.replace(':chapterId', chapter.id)}>
                        <Button className="w-full bg-green-600 hover:bg-green-700 focus:ring-green-500">
                            {UI_STRINGS.startQuiz} ({quizForChapter.questions.length} سوال)
                        </Button>
                    </Link>
                </Card>
            </section>
        )}
      </div>


      <div className="mt-12 text-center">
        <Link to={ROUTES.HOME}>
          <Button className="bg-gray-500 hover:bg-gray-600 focus:ring-gray-400">{UI_STRINGS.backToChapters}</Button>
        </Link>
      </div>
    </div>
  );
};

export const LessonPage: React.FC = () => {
  const { chapterId, lessonId } = useParams<{ chapterId: string; lessonId: string }>();
  const lesson = useMemo(() => findLesson(chapterId, lessonId), [chapterId, lessonId]);
  const { markLessonCompleted, recordExerciseAttempt, getExerciseStatus } = useUserProgress();
  const navigate = useNavigate();

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [showSolutionForCurrent, setShowSolutionForCurrent] = useState(false);
  const [exerciseFeedback, setExerciseFeedback] = useState<{isCorrect: boolean, message: string} | null>(null);
  
  useEffect(() => {
    // Auto-mark lesson as started/completed when page is visited and all exercises are done (or no exercises)
    // This is a simple completion, could be more sophisticated
    if (lesson && (!lesson.exercises || lesson.exercises.length === 0)) {
        markLessonCompleted(lesson.id);
    }
  }, [lesson, markLessonCompleted]);


  if (!lesson) {
    return <div className="text-center py-10 text-red-500 text-xl">درس مورد نظر یافت نشد.</div>;
  }
  
  const currentExercise = lesson.exercises[currentExerciseIndex];
  const exerciseStatus = currentExercise ? getExerciseStatus(currentExercise.id) : undefined;

  const handleAnswer = (isCorrect: boolean) => {
    if (currentExercise) {
      recordExerciseAttempt(currentExercise, isCorrect);
      setExerciseFeedback({isCorrect, message: isCorrect ? UI_STRINGS.correct : UI_STRINGS.incorrect});
      setShowSolutionForCurrent(true); // Show solution/explanation after an attempt
      if (isCorrect && currentExerciseIndex === lesson.exercises.length - 1) {
        markLessonCompleted(lesson.id); // Mark lesson completed if last exercise is correct
      }
    }
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < lesson.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setShowSolutionForCurrent(false);
      setExerciseFeedback(null);
    } else {
      // All exercises done
      markLessonCompleted(lesson.id);
      alert("شما تمام تمرینات این درس را به پایان رساندید!");
      navigate(ROUTES.CHAPTER.replace(':chapterId', chapterId || ''));
    }
  };
  
  const handleShowSolution = () => {
    if(currentExercise && !exerciseStatus?.correct) { // Only allow if not already correctly answered
        setShowSolutionForCurrent(true);
        if (!getExerciseStatus(currentExercise.id)?.attempts) { // If no attempt, record as one incorrect attempt
             recordExerciseAttempt(currentExercise, false);
        }
    }
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-8 rounded-xl shadow-2xl mb-10">
        <h1 className="text-4xl font-bold text-sky-800 mb-3">{lesson.title}</h1>
        <Link to={ROUTES.CHAPTER.replace(':chapterId', chapterId || '')} className="text-sky-600 hover:underline mb-6 block">
          بازگشت به فصل: {findChapter(chapterId)?.title}
        </Link>
        
        {lesson.videoUrl && (
            <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
                <img src={lesson.videoUrl} alt="ویدئوی آموزشی" className="w-full h-auto object-cover"/>
                {/* In a real app, this would be an embedded video player */}
            </div>
        )}

        <h2 className="text-3xl font-semibold text-sky-700 mt-8 mb-4 border-b-2 border-sky-200 pb-2">{UI_STRINGS.lessonContent}</h2>
        <MathText text={lesson.content} className="prose prose-lg max-w-none text-gray-800 leading-relaxed" />

        {lesson.solvedExamples.length > 0 && (
          <>
            <h2 className="text-3xl font-semibold text-sky-700 mt-10 mb-4 border-b-2 border-sky-200 pb-2">{UI_STRINGS.solvedExamples}</h2>
            <div className="space-y-6">
              {lesson.solvedExamples.map(ex => (
                <Card key={ex.id} className="bg-sky-50 p-6">
                  <MathText text={ex.problem} className="font-semibold text-lg text-sky-800 mb-3" />
                  <div className="space-y-2">
                    {ex.solutionSteps.map((step, idx) => (
                      <MathText key={idx} text={`<strong>${UI_STRINGS.solution} ${idx + 1}:</strong> ${step}`} className="text-gray-700" />
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {lesson.exercises.length > 0 && (
        <div className="bg-white p-8 rounded-xl shadow-2xl">
          <h2 className="text-3xl font-semibold text-sky-700 mb-6 border-b-2 border-sky-200 pb-2">{UI_STRINGS.exercises} ({currentExerciseIndex + 1} از {lesson.exercises.length})</h2>
          {currentExercise && (
            <div>
              <ExerciseHost exercise={currentExercise} onAnswer={handleAnswer} showSolutionTrigger={showSolutionForCurrent}/>
              <div className="mt-6 flex justify-between items-center">
                 <Button 
                    onClick={handleShowSolution} 
                    disabled={showSolutionForCurrent || exerciseStatus?.correct === true}
                    className="bg-amber-500 hover:bg-amber-600 focus:ring-amber-400"
                >
                  {UI_STRINGS.showSolution}
                </Button>
                { (exerciseStatus?.attempts && exerciseStatus?.attempts > 0) && ( // Show Next button only after an attempt or if solution is shown
                  <Button onClick={handleNextExercise}>
                    {currentExerciseIndex === lesson.exercises.length - 1 ? UI_STRINGS.backToLessons : UI_STRINGS.next}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
       {lesson.exercises.length === 0 && (
            <p className="text-gray-600 text-center py-4">{UI_STRINGS.noExercises}</p>
       )}
    </div>
  );
};

export const QuizPage: React.FC = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const quiz = useMemo(() => findQuiz(chapterId), [chapterId]);
  const { recordQuizScore, progress } = useUserProgress();
  const navigate = useNavigate();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{[key: string]: string | null}>({}); // { exerciseId: selectedOptionId }
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
      // Check if this quiz was already taken
      if (quiz && progress.quizScores[quiz.chapterId]) {
          const prevResult = progress.quizScores[quiz.chapterId];
          setScore(prevResult.score);
          setCorrectCount(prevResult.correctAnswers);
          setQuizFinished(true); 
      }
  }, [quiz, progress.quizScores]);


  if (!quiz) {
    return <div className="text-center py-10 text-red-500 text-xl">آزمون مورد نظر یافت نشد.</div>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleAnswerSelect = (questionId: string, selectedOptionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: selectedOptionId }));
  };

  const handleSubmitQuiz = () => {
    let correctAnswersCount = 0;
    quiz.questions.forEach(q => {
      if (q.type === 'MCQ' && answers[q.id] === (q as any).correctAnswerId) {
        correctAnswersCount++;
      }
      // Add logic for other question types if they are used in quizzes
    });
    const calculatedScore = (correctAnswersCount / quiz.questions.length) * 100;
    setScore(calculatedScore);
    setCorrectCount(correctAnswersCount);
    setQuizFinished(true);
    recordQuizScore(quiz.chapterId, calculatedScore, quiz.questions.length, correctAnswersCount);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  if (quizFinished) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-lg mx-auto text-center">
          <h1 className="text-3xl font-bold text-sky-700 mb-4">{UI_STRINGS.quizSummary}</h1>
          <h2 className="text-2xl text-sky-600 mb-2">{quiz.title}</h2>
          <p className="text-5xl font-bold my-6">
            {UI_STRINGS.score}: <span className={score >= 70 ? 'text-green-600' : score >= 40 ? 'text-yellow-500' : 'text-red-600'}>{score.toFixed(0)}%</span>
          </p>
          <p className="text-lg text-gray-700 mb-2">
            {UI_STRINGS.correctAnswers}: {correctCount} از {quiz.questions.length}
          </p>
          <Button onClick={() => navigate(ROUTES.CHAPTER.replace(':chapterId', quiz.chapterId))} className="mt-6">
            {UI_STRINGS.backToChapters}
          </Button>
        </Card>
      </div>
    );
  }
  
  if (!currentQuestion) return <LoadingDots />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-sky-700 mb-2">{quiz.title}</h1>
      <p className="text-center text-gray-600 mb-8">سوال {currentQuestionIndex + 1} از {quiz.questions.length}</p>
      
      <Card className="max-w-2xl mx-auto">
        <ExerciseHost 
            exercise={currentQuestion} 
            onAnswer={(isCorrect, selectedOptionId) => {
                if(selectedOptionId) handleAnswerSelect(currentQuestion.id, selectedOptionId);
            }}
            // In quiz mode, solution is typically not shown immediately per question
            showSolutionTrigger={false} 
        />
        <div className="mt-6 text-center">
          <Button onClick={handleNextQuestion} disabled={currentQuestion.type === 'MCQ' && !answers[currentQuestion.id]}>
            {currentQuestionIndex === quiz.questions.length - 1 ? UI_STRINGS.submit : UI_STRINGS.next}
          </Button>
        </div>
      </Card>
    </div>
  );
};


export const ProgressPage: React.FC = () => {
  const { progress, resetProgress } = useUserProgress();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const totalLessons = CHAPTERS_DATA.reduce((sum, chap) => sum + chap.lessons.length, 0);
  const completedLessonsCount = progress.completedLessons.length;
  const lessonsProgress = totalLessons > 0 ? (completedLessonsCount / totalLessons) * 100 : 0;

  const attemptedExercisesCount = Object.keys(progress.exerciseAttempts).length;
  const correctExercisesCount = Object.values(progress.exerciseAttempts).filter(att => att.correct).length;
  
  const quizzesTakenCount = Object.keys(progress.quizScores).length;
  const averageQuizScore = quizzesTakenCount > 0 
    ? Object.values(progress.quizScores).reduce((sum, q) => sum + q.score, 0) / quizzesTakenCount
    : 0;

  const handleReset = () => {
    resetProgress();
    setShowResetConfirm(false);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-sky-700 mb-10">{UI_STRINGS.yourProgress}</h1>
      
      {totalLessons === 0 && attemptedExercisesCount === 0 && quizzesTakenCount === 0 ? (
        <p className="text-center text-gray-600 text-xl">{UI_STRINGS.noProgress}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="text-center bg-sky-50">
            <h2 className="text-2xl font-semibold text-sky-700 mb-2">{UI_STRINGS.lessonsCompleted}</h2>
            <p className="text-5xl font-bold text-sky-600 my-3">{completedLessonsCount} <span className="text-2xl text-gray-500">/ {totalLessons}</span></p>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div className="bg-green-500 h-4 rounded-full" style={{ width: `${lessonsProgress}%` }}></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">{lessonsProgress.toFixed(0)}% تکمیل شده</p>
          </Card>

          <Card className="text-center bg-yellow-50">
            <h2 className="text-2xl font-semibold text-yellow-700 mb-2">{UI_STRINGS.exercisesAttempted}</h2>
            <p className="text-5xl font-bold text-yellow-600 my-3">{attemptedExercisesCount}</p>
            <p className="text-gray-700">{correctExercisesCount} پاسخ صحیح</p>
          </Card>

          <Card className="text-center bg-purple-50">
            <h2 className="text-2xl font-semibold text-purple-700 mb-2">{UI_STRINGS.quizzesTaken}</h2>
            <p className="text-5xl font-bold text-purple-600 my-3">{quizzesTakenCount}</p>
            {quizzesTakenCount > 0 && <p className="text-gray-700">میانگین امتیاز: {averageQuizScore.toFixed(0)}%</p>}
          </Card>
        </div>
      )}
      <div className="mt-12 text-center">
          <Button onClick={() => setShowResetConfirm(true)} className="bg-red-600 hover:bg-red-700 focus:ring-red-500">
            پاک کردن تمام پیشرفت‌ها
          </Button>
      </div>
      <Modal isOpen={showResetConfirm} onClose={() => setShowResetConfirm(false)} title="تایید پاک کردن">
        <p className="mb-6">آیا مطمئن هستید که می‌خواهید تمام پیشرفت‌های خود را پاک کنید؟ این عمل قابل بازگشت نیست.</p>
        <div className="flex justify-end space-x-3 space-x-reverse">
            <Button onClick={() => setShowResetConfirm(false)} className="bg-gray-300 hover:bg-gray-400 text-black focus:ring-gray-200">انصراف</Button>
            <Button onClick={handleReset} className="bg-red-600 hover:bg-red-700 focus:ring-red-500">پاک کردن</Button>
        </div>
      </Modal>
    </div>
  );
};
