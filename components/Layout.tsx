
import React from 'react';
import { useProgress } from '../store/ProgressContext';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  onBack?: () => void;
  onHome?: () => void;
  backLabel?: string;
  showProfile?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, title, onBack, onHome, backLabel, showProfile }) => {
  const { user } = useProgress();
  const [isOnline, setIsOnline] = React.useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-indigo-100 font-sans text-gray-800">
      <header className="bg-white shadow-xl sticky top-0 z-50 rounded-b-[2rem] border-b-4 border-indigo-400">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <button 
                onClick={onBack}
                className="p-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full transition-all shadow-md active:scale-90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {onHome && (
               <button 
                onClick={onHome}
                className="flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-full transition-all shadow-md font-bold"
               >
                 <span>🏠</span>
                 <span className="hidden sm:inline">Inicio</span>
               </button>
            )}

            <div className="flex flex-col ml-2 truncate">
              <h1 className="text-xl md:text-2xl font-black text-indigo-700 tracking-tight truncate">
                {title || 'NATSEVILLA 3.0'}
              </h1>
              {!isOnline && (
                <span className="text-[10px] text-amber-600 font-bold uppercase tracking-widest animate-pulse">
                  ⚠️ Modo sin Internet
                </span>
              )}
            </div>
          </div>
          
          {showProfile && (
            <div 
              onClick={showProfile}
              className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full cursor-pointer transition border-2 border-indigo-200"
            >
              <span className="text-2xl">{user.avatar}</span>
              <div className="hidden md:block">
                <p className="text-sm font-black text-indigo-900 leading-none">{user.name}</p>
                <p className="text-[10px] text-indigo-500 font-bold">NIVEL {user.level}</p>
              </div>
            </div>
          )}
        </div>
      </header>

      {!isOnline && (
        <div className="bg-amber-500 text-white font-black text-center py-2 px-4 text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all">
          <span>⚠️</span>
          <span>¡Sin internet! No te preocupes, NATSEVILLA 3.0 activó el sistema de lecciones y retos locales para que sigas aprendiendo.</span>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 py-8 pb-24">
        {children}
      </main>

      <footer className="text-center py-8 text-indigo-900/50 text-sm font-medium">
        <p className="flex items-center justify-center gap-2 mb-1">
          <span>🇨🇴</span> Alineado con los DBA de Colombia
        </p>
        <p>2025 Explora y Aprende con NATSEVILLA 3.0</p>
      </footer>
    </div>
  );
};
