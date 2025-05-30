
import { Chapter, Lesson, ExerciseType, MCQExercise, SolvedExample, Quiz } from './types';

export const APP_TITLE = "آموزش ریاضی هفتم";

export const ROUTES = {
  HOME: '/',
  CHAPTER: '/chapter/:chapterId',
  LESSON: '/chapter/:chapterId/lesson/:lessonId',
  QUIZ: '/chapter/:chapterId/quiz',
  PROGRESS: '/progress',
};

export const UI_STRINGS = {
  chapters: "فصل‌ها",
  lessons: "درس‌ها",
  exercises: "تمرینات",
  solvedExamples: "مثال‌های حل شده",
  quiz: "آزمون",
  progress: "پیشرفت من",
  startLesson: "شروع درس",
  startQuiz: "شروع آزمون",
  next: "بعدی",
  previous: "قبلی",
  submit: "ثبت پاسخ",
  correct: "صحیح!",
  incorrect: "اشتباه!",
  showSolution: "نمایش راه حل",
  solution: "راه حل",
  yourAnswer: "پاسخ شما:",
  correctAnswer: "پاسخ صحیح:",
  tryAgain: "تلاش مجدد",
  backToLessons: "بازگشت به درس‌ها",
  backToChapters: "بازگشت به فصل‌ها",
  completed: "تکمیل شده",
  partiallyCompleted: "نیمه تمام",
  notStarted: "شروع نشده",
  difficultyEasy: "ساده",
  difficultyMedium: "متوسط",
  difficultyHard: "دشوار",
  lessonContent: "محتوای درس",
  noLessons: "درسی برای این فصل یافت نشد.",
  noExercises: "تمرینی برای این درس یافت نشد.",
  noExamples: "مثال حل شده‌ای برای این درس یافت نشد.",
  selectAnswer: "یک گزینه را انتخاب کنید.",
  quizSummary: "نتیجه آزمون",
  score: "امتیاز",
  questions: "سوالات",
  correctAnswers: "پاسخ‌های صحیح",
  yourProgress: "پیشرفت شما",
  lessonsCompleted: "درس‌های تکمیل شده",
  exercisesAttempted: "تمرینات انجام شده",
  quizzesTaken: "آزمون‌های داده شده",
  noProgress: "هنوز پیشرفتی ثبت نشده است.",
  comingSoon: "به زودی...",
  selectChapter: "یک فصل را انتخاب کنید",
  problemSolvingStrategies: "راهبردهای حل مسئله",
  integers: "عددهای صحیح",
  algebraAndEquations: "جبر و معادله",
  geometryAndReasoning: "هندسه و استدلال",
  divisorsAndPrimeNumbers: "شمارنده‌ها و اعداد اول",
  areaAndVolume: "سطح و حجم",
  powersAndRoots: "توان و جذر",
  vectorsAndCoordinates: "بردار و مختصات",
  statisticsAndProbability: "آمار و احتمال",
};

const placeholderVideoUrl = "https://picsum.photos/seed/mathvideo/400/225"; // Placeholder for video thumbnail

const sampleMCQ1: MCQExercise = {
  id: 'mcq1-ch1-l1',
  type: ExerciseType.MCQ,
  difficulty: 'easy',
  question: `حاصل $2 + 2$ کدام است؟`,
  options: [
    { id: 'opt1', text: '۳' },
    { id: 'opt2', text: '۴' },
    { id: 'opt3', text: '۵' },
  ],
  correctAnswerId: 'opt2',
  explanation: `جمع دو عدد ۲ برابر با ۴ می‌شود. $2+2=4$.`,
};

const sampleMCQ2: MCQExercise = {
  id: 'mcq2-ch1-l1',
  type: ExerciseType.MCQ,
  difficulty: 'medium',
  question: `اگر $x - 5 = 10$ باشد، مقدار $x$ چقدر است؟`,
  options: [
    { id: 'opt1', text: '۵' },
    { id: 'opt2', text: '۱۰' },
    { id: 'opt3', text: '۱۵' },
  ],
  correctAnswerId: 'opt3',
  explanation: `برای پیدا کردن $x$, عدد ۵ را به طرف دیگر معادله می‌بریم: $x = 10 + 5$, پس $x = 15$.`,
};

const sampleSolvedExample1: SolvedExample = {
  id: 'ex1-ch1-l1',
  problem: `مسئله: یک باغچه مستطیل شکل به طول ۸ متر و عرض ۵ متر داریم. محیط این باغچه چقدر است؟`,
  solutionSteps: [
    `فرمول محیط مستطیل برابر است با: $(طول + عرض) \\times 2$.`,
    `در این مسئله، طول = ۸ متر و عرض = ۵ متر.`,
    `پس محیط برابر است با: $(8 + 5) \\times 2 = 13 \\times 2 = 26$ متر.`,
  ],
};

const sampleLesson1Chapter1: Lesson = {
  id: 'l1-ch1',
  title: 'درس اول: مقدمه‌ای بر حل مسئله',
  content: `
    <p>در این درس با راهبردهای اولیه حل مسئله آشنا می‌شویم. حل مسئله یک مهارت کلیدی در ریاضیات است.</p>
    <p>یکی از راهبردهای مهم، <strong>رسم شکل</strong> است. برای مثال، در مسائل هندسی، رسم شکل به درک بهتر مسئله کمک می‌کند.</p>
    <p>راهبرد دیگر، <strong>حدس و آزمایش</strong> است که در آن با حدس‌های منطقی به جواب نزدیک می‌شویم. مثال: مجموع دو عدد ۱۰ و اختلاف آنها ۲ است. آن دو عدد کدامند؟</p>
    <p>فرمول مساحت مستطیل: $A = l \\times w$</p>
    <p>فرمول محیط دایره: $C = 2 \\pi r$</p>
  `,
  solvedExamples: [sampleSolvedExample1],
  exercises: [sampleMCQ1, sampleMCQ2],
  videoUrl: placeholderVideoUrl,
};

export const CHAPTERS_DATA: Chapter[] = [
  {
    id: 'ch1',
    title: UI_STRINGS.problemSolvingStrategies,
    description: 'آشنایی با روش‌های مختلف برای حل مسائل ریاضی.',
    icon: '🧠',
    lessons: [
      sampleLesson1Chapter1,
      {
        id: 'l2-ch1',
        title: 'درس دوم: راهبرد حذف حالت‌های نامطلوب',
        content: '<p>در این راهبرد، با حذف گزینه‌هایی که با شرایط مسئله سازگار نیستند، به پاسخ صحیح نزدیک می‌شویم.</p><p>مثال: یک عدد دو رقمی را در نظر بگیرید که مجموع ارقام آن ۷ باشد و رقم دهگان آن از رقم یکان بزرگتر باشد. آن عدد چیست؟</p><p>اعداد ممکن با مجموع ارقام ۷: ۱۶, ۲۵, ۳۴, ۴۳, ۵۲, ۶۱, ۷۰.</p><p>حال شرط دوم را بررسی می‌کنیم (دهگان > یکان): ۴۳, ۵۲, ۶۱, ۷۰.</p>',
        solvedExamples: [],
        exercises: [
          {
            id: 'mcq1-ch1-l2', type: ExerciseType.MCQ, difficulty: 'medium',
            question: 'کدام عدد دو رقمی مجموع ارقامش ۸ و رقم دهگانش ۳ واحد بیشتر از یکانش است؟',
            options: [{id:'a',text:'26'}, {id:'b',text:'62'}, {id:'c',text:'53'}],
            correctAnswerId: 'c',
            explanation: 'اعداد با مجموع ارقام ۸: ۱۷, ۲۶, ۳۵, ۴۴, ۵۳, ۶۲, ۷۱, ۸۰. اعدادی که دهگان ۳ واحد از یکان بیشتر است: ۵۳ (۵-۲=۳). پس ۵۳ صحیح است.'
          }
        ],
      },
    ],
  },
  {
    id: 'ch2',
    title: UI_STRINGS.integers,
    description: 'مفاهیم اعداد صحیح، جمع، تفریق، ضرب و تقسیم آن‌ها.',
    icon: '🔢',
    lessons: [
      {
        id: 'l1-ch2',
        title: 'درس اول: معرفی اعداد صحیح',
        content: '<p>اعداد صحیح شامل اعداد مثبت، منفی و صفر هستند. $\\{\\dots, -3, -2, -1, 0, 1, 2, 3, \\dots\\}$</p>',
        solvedExamples: [],
        exercises: [
            {
                id: 'mcq1-ch2-l1', type: ExerciseType.MCQ, difficulty: 'easy',
                question: 'کدام یک از اعداد زیر صحیح نیست؟',
                options: [{id:'a',text:'-5'}, {id:'b',text:'0'}, {id:'c',text:'2.5'}],
                correctAnswerId: 'c',
                explanation: 'عدد ۲.۵ یک عدد اعشاری است و جزو اعداد صحیح نیست.'
            }
        ],
      },
    ],
  },
  // Add more chapters with placeholder content for brevity
  { id: 'ch3', title: UI_STRINGS.algebraAndEquations, description: 'مقدمه‌ای بر جبر، متغیرها و حل معادلات ساده.', icon: '🔣', lessons: [] },
  { id: 'ch4', title: UI_STRINGS.geometryAndReasoning, description: 'اشکال هندسی، زاویه‌ها و استدلال‌های هندسی.', icon: '📐', lessons: [] },
  { id: 'ch5', title: UI_STRINGS.divisorsAndPrimeNumbers, description: 'شمارنده‌ها، اعداد اول و مفاهیم مرتبط.', icon: '🧩', lessons: [] },
  // For brevity, other chapters are defined with minimal structure.
  // In a full app, each would have detailed lessons, examples, and exercises.
];

export const QUIZZES_DATA: Quiz[] = [
    {
        id: 'quiz-ch1',
        chapterId: 'ch1',
        title: `آزمون فصل اول: ${UI_STRINGS.problemSolvingStrategies}`,
        questions: [sampleMCQ1, sampleMCQ2, {
            id: 'mcq3-ch1-quiz', type: ExerciseType.MCQ, difficulty: 'hard',
            question: 'محیط مربعی با مساحت $25 \\text{cm}^2$ چقدر است؟',
            options: [{id:'a',text:'20 cm'}, {id:'b',text:'25 cm'}, {id:'c',text:'10 cm'}],
            correctAnswerId: 'a',
            explanation: 'اگر مساحت مربع $s^2 = 25$, پس ضلع مربع $s = \\sqrt{25} = 5 \\text{ cm}$. محیط مربع $4s = 4 \\times 5 = 20 \\text{ cm}$.'
        }]
    },
    {
        id: 'quiz-ch2',
        chapterId: 'ch2',
        title: `آزمون فصل دوم: ${UI_STRINGS.integers}`,
        questions: [
            {
                id: 'mcq1-ch2-quiz', type: ExerciseType.MCQ, difficulty: 'easy',
                question: 'حاصل $(-3) + (+5)$ کدام است؟',
                options: [{id:'a',text:'-8'}, {id:'b',text:'2'}, {id:'c',text:'-2'}],
                correctAnswerId: 'b'
            },
            {
                id: 'mcq2-ch2-quiz', type: ExerciseType.MCQ, difficulty: 'medium',
                question: 'حاصل $(-4) \\times (-2)$ کدام است؟',
                options: [{id:'a',text:'8'}, {id:'b',text:'-8'}, {id:'c',text:'6'}],
                correctAnswerId: 'a'
            }
        ]
    }
];
