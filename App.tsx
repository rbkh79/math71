
import React from 'react';
import { HashRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import { HomePage, ChapterPage, LessonPage, QuizPage, ProgressPage } from './pages';
import { APP_TITLE, UI_STRINGS, ROUTES as APP_ROUTES } from './constants';
// Corrected import path if needed, ensure this matches importmap
import { HomeIcon, BookOpenIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const Navbar: React.FC = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
    `flex items-center space-x-2 space-x-reverse px-4 py-3 rounded-lg transition-colors duration-200 hover:bg-sky-700 ${
      isActive ? 'bg-sky-700 text-white shadow-inner' : 'text-sky-100 hover:text-white'
    }`;

  return (
    <nav className="bg-sky-800 text-white shadow-lg p-4 sticky top-0 z-40">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <Link to={APP_ROUTES.HOME} className="text-2xl font-bold mb-4 sm:mb-0 hover:text-sky-300 transition-colors">
          {APP_TITLE}
        </Link>
        <div className="flex flex-wrap justify-center space-x-1 space-x-reverse sm:space-x-2 sm:space-x-reverse">
          <NavLink to={APP_ROUTES.HOME} className={navLinkClass} end>
            <HomeIcon className="h-5 w-5" />
            <span>{UI_STRINGS.chapters}</span>
          </NavLink>
          {/* Placeholder for a direct lessons link if needed, or rely on chapter navigation */}
          {/* <NavLink to="/all-lessons" className={navLinkClass}> <BookOpenIcon className="h-5 w-5" /> <span>{UI_STRINGS.lessons}</span> </NavLink> */}
          <NavLink to={APP_ROUTES.PROGRESS} className={navLinkClass}>
            <CheckCircleIcon className="h-5 w-5" />
            <span>{UI_STRINGS.progress}</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 text-center p-6 mt-auto">
      <p>&copy; {new Date().getFullYear()} {APP_TITLE}. تمامی حقوق محفوظ است.</p>
      <p className="text-sm mt-1">ساخته شده با ❤️ برای دانش‌آموزان پایه هفتم.</p>
    </footer>
  );
};

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-100">
      <Navbar />
      <main className="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <MainLayout>
        <Routes>
          <Route path={APP_ROUTES.HOME} element={<HomePage />} />
          <Route path={APP_ROUTES.CHAPTER} element={<ChapterPage />} />
          <Route path={APP_ROUTES.LESSON} element={<LessonPage />} />
          <Route path={APP_ROUTES.QUIZ} element={<QuizPage />} />
          <Route path={APP_ROUTES.PROGRESS} element={<ProgressPage />} />
           {/* Fallback for unknown routes */}
          <Route path="*" element={
            <div className="text-center py-20">
              <h1 className="text-6xl font-bold text-sky-600 mb-4">404</h1>
              <p className="text-2xl text-gray-700 mb-8">صفحه مورد نظر یافت نشد.</p>
              <Link to={APP_ROUTES.HOME} className="text-sky-600 hover:text-sky-800 text-lg underline">
                بازگشت به صفحه اصلی
              </Link>
            </div>
          } />
        </Routes>
      </MainLayout>
    </HashRouter>
  );
};

export default App;
