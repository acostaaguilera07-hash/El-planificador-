
import React, { useState, useRef } from 'react';
import { Subject, Difficulty, Grade } from '../types';
import { LazyGeneratedImage } from './LazyGeneratedImage';
import { exportToWord } from '../services/exportService';

interface TheoryViewerProps {
  content: string;
  imageSrc: string | null;
  isLoading: boolean;
  onStartQuiz: (difficulty: Difficulty) => void;
  subject: Subject | null;
  grade?: Grade | null;
}

const getTheme = (subject: Subject | null) => {
  switch (subject) {
    case Subject.MATH:
      return { bg: 'bg-blue-50', pattern: 'radial-gradient(#3B82F6 1px, transparent 1px)', accent: 'text-blue-700', cardBg: 'bg-white', border: 'border-blue-200', heroIcon: '🧮', bullet: '🔢' };
    case Subject.SCIENCE:
      return { bg: 'bg-green-50', pattern: 'radial-gradient(#22c55e 1px, transparent 1px)', accent: 'text-green-700', cardBg: 'bg-white', border: 'border-green-200', heroIcon: '🔬', bullet: '🌿' };
    case Subject.SOCIAL:
      return { bg: 'bg-yellow-50', pattern: 'radial-gradient(#eab308 1px, transparent 1px)', accent: 'text-yellow-800', cardBg: 'bg-white', border: 'border-yellow-200', heroIcon: '🌍', bullet: '📍' };
    case Subject.LANGUAGE:
      return { bg: 'bg-pink-50', pattern: 'radial-gradient(#ec4899 1px, transparent 1px)', accent: 'text-pink-700', cardBg: 'bg-white', border: 'border-pink-200', heroIcon: '📚', bullet: '✍️' };
    case Subject.ARTS:
      return { bg: 'bg-purple-50', pattern: 'radial-gradient(#a855f7 1px, transparent 1px)', accent: 'text-purple-700', cardBg: 'bg-white', border: 'border-purple-200', heroIcon: '🎨', bullet: '🖌️' };
    case Subject.RELIGION:
      return { bg: 'bg-amber-50', pattern: 'radial-gradient(#f59e0b 1px, transparent 1px)', accent: 'text-amber-700', cardBg: 'bg-white', border: 'border-amber-200', heroIcon: '🕊️', bullet: '✨' };
    case Subject.PHYSICAL_ED:
      return { bg: 'bg-orange-50', pattern: 'radial-gradient(#ea580c 1px, transparent 1px)', accent: 'text-orange-700', cardBg: 'bg-white', border: 'border-orange-200', heroIcon: '🏀', bullet: '🏁' };
    case Subject.ETHICS:
      return { bg: 'bg-teal-50', pattern: 'radial-gradient(#14b8a6 1px, transparent 1px)', accent: 'text-teal-700', cardBg: 'bg-white', border: 'border-teal-200', heroIcon: '💖', bullet: '🤝' };
    case Subject.ENGLISH:
      return { bg: 'bg-sky-50', pattern: 'radial-gradient(#0ea5e9 1px, transparent 1px)', accent: 'text-sky-700', cardBg: 'bg-white', border: 'border-sky-200', heroIcon: '🇬🇧', bullet: '🔡' };
    default:
      return { bg: 'bg-gray-50', pattern: '', accent: 'text-indigo-700', cardBg: 'bg-white', border: 'border-indigo-200', heroIcon: '✨', bullet: '🔹' };
  }
};

export const TheoryViewer: React.FC<TheoryViewerProps> = ({ content, imageSrc, isLoading, onStartQuiz, subject, grade }) => {
  const [showDifficulty, setShowDifficulty] = useState(false);
  const articleRef = useRef<HTMLElement>(null);
  const theme = getTheme(subject);

  const handleDownloadWord = () => {
    if (!content) return;
    
    // Recolectar imágenes del DOM (que ya fueron generadas por LazyGeneratedImage)
    const inlineImages: Record<string, string> = {};
    if (articleRef.current) {
      const images = articleRef.current.querySelectorAll('img');
      images.forEach(img => {
        const prompt = img.getAttribute('alt');
        const src = img.getAttribute('src');
        if (prompt && src && src.startsWith('data:')) {
          inlineImages[prompt] = src;
        }
      });
    }

    const title = content.split('\n')[0].replace('# ', '') || 'Clase NATSEVILLA';
    exportToWord(
      title, 
      content, 
      grade || Grade.THIRD, 
      subject || Subject.MATH, 
      'Docente Miguel Sevilla Hernandez',
      imageSrc,
      inlineImages
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse relative overflow-hidden rounded-3xl bg-white/50 border-4 border-dashed border-gray-300">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: theme.pattern, backgroundSize: '20px 20px' }}></div>
        <div className="text-8xl mb-6 animate-bounce">{theme.heroIcon}</div>
        <p className="text-3xl text-gray-700 font-black text-center z-10">Creando materiales nítidos...</p>
        <p className="text-gray-500 mt-2 z-10 font-medium">Estamos dibujando las gráficas y preparando el texto.</p>
      </div>
    );
  }

  const lines = content.split('\n');
  const renderedContent: React.ReactNode[] = [];
  let listBuffer: string[] = [];

  const flushList = (keyPrefix: number) => {
    if (listBuffer.length > 0) {
      renderedContent.push(
        <div key={`list-${keyPrefix}`} className="grid grid-cols-1 gap-3 my-6 pl-2 md:pl-6">
          {listBuffer.map((item, idx) => (
            <div key={idx} className={`${theme.cardBg} p-4 rounded-xl border-l-8 ${theme.border} shadow-sm flex items-start gap-3`}>
               <div className="mt-1 text-2xl shrink-0">{theme.bullet}</div>
               <div className="text-gray-700 font-medium text-lg leading-relaxed">
                 {item.split(/\*\*(.*?)\*\*/g).map((part, i) => 
                   i % 2 === 1 ? <span key={i} className={`${theme.accent} font-bold`}>{part}</span> : part
                 )}
               </div>
            </div>
          ))}
        </div>
      );
      listBuffer = [];
    }
  };

  lines.forEach((line, i) => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('<<IMAGE:')) {
        flushList(i);
        const prompt = trimmedLine.replace('<<IMAGE:', '').replace('>>', '').trim();
        renderedContent.push(<LazyGeneratedImage key={`img-${i}`} prompt={prompt} subject={subject} />);
        return;
    }
    if (trimmedLine.startsWith('- ')) {
      listBuffer.push(trimmedLine.replace('- ', ''));
      return;
    } 
    flushList(i);
    if (line.startsWith('# ')) {
        renderedContent.push(
            <div key={i} className="text-center py-6 mb-8 border-b-2 border-gray-100">
                <h1 className={`text-4xl md:text-5xl font-black ${theme.accent} tracking-tight`}>{line.replace('# ', '')}</h1>
            </div>
        );
        return;
    }
    if (line.startsWith('## ')) {
        renderedContent.push(
            <div key={i} className="mt-10 mb-4 pb-2 border-b border-gray-200">
                <h2 className={`text-2xl md:text-3xl font-bold ${theme.accent} flex items-center gap-2`}>{line.replace('## ', '')}</h2>
            </div>
        );
        return;
    }
    if (trimmedLine.startsWith('>')) {
        renderedContent.push(
            <div key={i} className="bg-yellow-50 border-l-8 border-yellow-400 p-6 my-6 rounded-r-xl shadow-sm">
                <div className="flex items-start gap-4">
                    <span className="text-4xl">💡</span>
                    <p className="text-yellow-900 font-bold text-lg italic">{trimmedLine.replace('>', '').replace('💡', '')}</p>
                </div>
            </div>
        );
        return;
    }
    if (trimmedLine !== '') {
        renderedContent.push(
            <p key={i} className="text-lg md:text-xl text-gray-700 leading-8 mb-4">
                 {line.split(/\*\*(.*?)\*\*/g).map((part, idx) => 
                   idx % 2 === 1 ? <span key={idx} className={`${theme.accent} font-bold`}>{part}</span> : part
                 )}
            </p>
        );
    }
  });
  flushList(lines.length);

  return (
    <div className={`min-h-screen ${theme.bg} rounded-[2rem] shadow-xl overflow-hidden relative border-4 border-white`}>
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: theme.pattern, backgroundSize: '24px 24px' }}></div>
      <div className="max-w-4xl mx-auto p-6 md:p-10 relative z-10">
        <div className="flex justify-end mb-4">
            <button 
                onClick={handleDownloadWord}
                className="flex items-center gap-2 bg-[#2b579a] hover:bg-[#1e3e6e] text-white px-6 py-3 rounded-full font-black shadow-lg transition-all hover:scale-105 active:scale-95 text-sm uppercase tracking-wide border-2 border-white/20"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Exportar Word con Imágenes
            </button>
        </div>

        <article ref={articleRef} className="bg-white/95 backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
            {imageSrc && (
                <div className="mb-10 flex justify-center">
                    <div className="relative transform hover:scale-[1.01] transition-transform duration-500 w-full max-w-lg">
                        <div className="absolute inset-0 bg-black/5 translate-x-2 translate-y-2 rounded-2xl blur-md"></div>
                        <img 
                            src={imageSrc} 
                            alt="Imagen Principal" 
                            referrerPolicy="no-referrer"
                            className="relative w-full h-64 md:h-80 object-cover rounded-2xl shadow-xl border-4 border-white"
                        />
                    </div>
                </div>
            )}
            {renderedContent}
        </article>
        
        <div className="flex flex-col items-center justify-center pt-10 pb-6 gap-6">
            <div className="bg-white px-6 py-3 rounded-full shadow-sm border border-gray-100">
                <p className="text-gray-600 font-bold text-lg">¿Aprendiste todo? ¡Demuéstralo!</p>
            </div>
            {!showDifficulty ? (
              <button onClick={() => setShowDifficulty(true)} className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xl md:text-2xl py-4 px-12 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                <span className="flex items-center gap-3">
                  <span>Iniciar Reto SABER ICFES</span>
                  <span className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-sm">✍️</span>
                </span>
              </button>
            ) : (
              <div className="flex flex-col md:flex-row gap-4 animate-fade-in-up">
                {[[Difficulty.EASY, '🌱 Explorador'], [Difficulty.MEDIUM, '🦁 Aventurero'], [Difficulty.HARD, '🚀 Experto']].map(([diff, label]) => (
                    <button key={diff} onClick={() => onStartQuiz(diff as Difficulty)} className={`${diff === Difficulty.EASY ? 'bg-green-500' : diff === Difficulty.MEDIUM ? 'bg-yellow-500' : 'bg-red-500'} text-white font-black py-4 px-8 rounded-2xl shadow-md transition-transform hover:scale-105 uppercase text-sm`}>
                        {label}
                    </button>
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
