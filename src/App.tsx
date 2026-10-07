import { useState, useCallback, useEffect } from 'react';
import { lessons } from '@/data/lessons';
import { HomeView } from '@/components/HomeView';
import { TheoryView } from '@/components/TheoryView';
import { QuizView } from '@/components/QuizView';
import { LockScreen } from '@/components/LockScreen';
import { useProgress } from '@/hooks/useProgress';

type View = 'home' | 'theory' | 'quiz';
const LOCK_KEY = 'pivot-boss-unlocked';

function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [view, setView] = useState<View>('home');
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);
  const { progress, completeLesson, resetProgress } = useProgress();

  useEffect(() => {
    try {
      if (localStorage.getItem(LOCK_KEY) === 'true') {
        setUnlocked(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const activeLesson = lessons.find((l) => l.id === activeLessonId) ?? null;

  const handleStartLesson = useCallback((lessonId: number) => {
    setActiveLessonId(lessonId);
    setView('theory');
  }, []);

  const handleContinueToQuiz = useCallback(() => {
    setView('quiz');
  }, []);

  const handleQuizComplete = useCallback(
    (correctCount: number) => {
      if (activeLessonId !== null) {
        completeLesson(activeLessonId, correctCount, activeLesson?.questions.length ?? 0);
      }
    },
    [activeLessonId, activeLesson, completeLesson],
  );

  const handleBackHome = useCallback(() => {
    setView('home');
    setActiveLessonId(null);
  }, []);

  const handleReset = useCallback(() => {
    resetProgress();
  }, [resetProgress]);

  if (!unlocked) {
    return <LockScreen onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <button
            onClick={handleBackHome}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-sm">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 13.5h4.5l1.5 3 3-6 1.5 3H21"
                />
              </svg>
            </div>
            <span className="font-bold text-slate-800 text-sm md:text-base group-hover:text-emerald-600 transition-colors">
              Pivot Boss
            </span>
          </button>

          {progress.totalPoints > 0 && (
            <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-full">
              <svg
                className="w-4 h-4 text-amber-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-bold text-amber-700">{progress.totalPoints}</span>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="px-4 md:px-6 py-6 md:py-10">
        {view === 'home' && (
          <HomeView
            progress={progress}
            onStartLesson={handleStartLesson}
            onReset={handleReset}
          />
        )}

        {v== iew ='theory' && activeLesson && (
          <TheoryView
            lesson={activeLesson}
            onContinue={handleContinueToQuiz}
            onBack={handleBackHome}
          />
        )}

        {view === 'quiz' && activeLesson && (
          <QuizView
            lesson={activeLesson}
            onComplete={handleQuizComplete}
            onBack={handleBackHome}
          />
        )}
      </main>
    </div>
  );
}

export default App;
