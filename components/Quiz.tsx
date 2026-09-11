
import React, { useState, useRef } from 'react';
import { QuizQuestion, Difficulty, Grade, Subject } from '../types';
import { LazyGeneratedImage } from './LazyGeneratedImage';
import { exportQuizToWord } from '../services/exportService';

interface QuizProps {
  questions: QuizQuestion[];
  isLoading: boolean;
  onComplete: (score: number, total: number, breakdown: Record<string, { correct: number; total: number }>) => void;
  onRetry: () => void;
  grade?: Grade | null;
  subject?: Subject | null;
  topic?: string | null;
}

export const Quiz: React.FC<QuizProps> = ({ questions, isLoading, onComplete, onRetry, grade, subject, topic }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answersLog, setAnswersLog] = useState<boolean[]>([]);
  const quizContainerRef = useRef<HTMLDivElement>(null);

  const handleExportQuiz = () => {
    if (!questions.length) return;
    
    // Recolectar imágenes generadas en el DOM
    const quizImages: Record<string, string> = {};
    if (quizContainerRef.current) {
        const images = quizContainerRef.current.querySelectorAll('img');
        images.forEach(img => {
            const prompt = img.getAttribute('alt');
            const src = img.getAttribute('src');
            if (prompt && src && src.startsWith('data:')) {
                quizImages[prompt] = src;
            }
        });
    }

    exportQuizToWord(
        questions,
        grade || Grade.THIRD,
        subject || Subject.MATH,
        topic || 'Evaluación General',
        'Docente Miguel Sevilla Hernandez',
        quizImages
    );
  };

  if (isLoading) {
     return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <div className="text-6xl mb-4 animate-bounce">📝</div>
        <p className="text-2xl text-indigo-700 font-black">Preparando Evaluación Nítida...</p>
        <p className="text-gray-500 mt-2 font-medium italic">Dibujando situaciones para tus estudiantes</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 text-lg font-bold">No pudimos generar las preguntas.</p>
        <button onClick={onRetry} className="mt-4 bg-indigo-500 text-white px-6 py-2 rounded-full font-bold">Reintentar</button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionClick = (index: number) => {
    if (isAnswerChecked) return;
    setSelectedOption(index);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    const isCorrect = selectedOption === currentQuestion.correctAnswerIndex;
    if (isCorrect) setScore(prev => prev + 1);
    const newLog = [...answersLog];
    newLog[currentQuestionIndex] = isCorrect;
    setAnswersLog(newLog);
    setIsAnswerChecked(true);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
      setShowExplanation(false);
    } else {
      const breakdown: Record<string, { correct: number; total: number }> = {};
      questions.forEach((q, idx) => {
          const comp = q.competency || 'General';
          if (!breakdown[comp]) breakdown[comp] = { correct: 0, total: 0 };
          breakdown[comp].total += 1;
          if (answersLog[idx]) breakdown[comp].correct += 1;
      });
      onComplete(score, questions.length, breakdown);
    }
  };

  return (
    <div className="max-w-2xl mx-auto" ref={quizContainerRef}>
      <div className="flex justify-between items-center mb-6">
          <button 
            onClick={handleExportQuiz}
            className="flex items-center gap-2 bg-[#2b579a] text-white px-4 py-2 rounded-full text-xs font-black shadow-md hover:scale-105 transition-all uppercase"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Exportar Examen a Word
          </button>
          <div className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-sm">
             {currentQuestion.competency || 'SABER'}
          </div>
      </div>

      <div className="mb-6 bg-gray-200 rounded-full h-3 overflow-hidden border-2 border-white shadow-inner">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all duration-500" style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}></div>
      </div>

      <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-2xl border-b-8 border-gray-200 relative overflow-hidden">
        <span className="absolute top-0 right-0 bg-indigo-600 text-white px-5 py-1.5 rounded-bl-3xl font-black text-sm shadow-md">
          {currentQuestionIndex + 1} / {questions.length}
        </span>
        
        {currentQuestion.context && (
            <div className="bg-blue-50/50 border-l-8 border-indigo-400 p-6 rounded-r-3xl mb-8 mt-6">
                {currentQuestion.imagePrompt && (
                    <LazyGeneratedImage prompt={currentQuestion.imagePrompt} className="max-w-xs mx-auto mb-4" />
                )}
                <p className="text-gray-700 text-xl leading-relaxed italic font-medium">
                    "{currentQuestion.context}"
                </p>
            </div>
        )}

        <h2 className="text-2xl font-black text-gray-800 mb-8 leading-tight">
            {currentQuestion.question}
        </h2>

        <div className="space-y-4">
          {currentQuestion.options.map((option, idx) => {
            let btnClass = "w-full text-left p-5 rounded-2xl border-2 transition-all font-bold text-lg flex items-center group shadow-sm ";
            if (isAnswerChecked) {
              if (idx === currentQuestion.correctAnswerIndex) btnClass += "bg-green-100 border-green-500 text-green-800";
              else if (idx === selectedOption) btnClass += "bg-red-100 border-red-500 text-red-800";
              else btnClass += "bg-gray-50 border-gray-200 opacity-50";
            } else {
              btnClass += selectedOption === idx ? "bg-indigo-50 border-indigo-500 text-indigo-800 scale-[1.02] shadow-md" : "bg-white border-gray-100 hover:border-indigo-200 hover:bg-indigo-50";
            }
            return (
              <button key={idx} onClick={() => handleOptionClick(idx)} className={btnClass} disabled={isAnswerChecked}>
                <span className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full border-2 mr-4 font-black transition-colors ${
                    isAnswerChecked && idx === currentQuestion.correctAnswerIndex ? 'bg-green-500 text-white border-green-600' : 
                    selectedOption === idx ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-white text-gray-400 border-gray-100 group-hover:border-indigo-200'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{option}</span>
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className={`mt-10 p-6 rounded-3xl animate-fade-in-up border-4 ${selectedOption === currentQuestion.correctAnswerIndex ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
            <h4 className="font-black text-xl mb-3 flex items-center gap-3">
              {selectedOption === currentQuestion.correctAnswerIndex ? '🎯 ¡Excelente!' : '📚 Para aprender:'}
            </h4>
            <p className="text-gray-700 text-lg leading-relaxed">{currentQuestion.explanation}</p>
          </div>
        )}

        <div className="mt-10 flex justify-end">
          {!isAnswerChecked ? (
            <button
              onClick={handleCheckAnswer}
              disabled={selectedOption === null}
              className={`px-10 py-4 rounded-full font-black text-xl text-white transition-all transform ${selectedOption === null ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-105 shadow-xl active:scale-95'}`}
            >
              Responder
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-10 py-4 rounded-full font-black text-xl text-white bg-green-500 hover:bg-green-600 hover:scale-105 shadow-xl flex items-center gap-3"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Siguiente Pregunta ➡️' : 'Ver Mis Resultados 🏆'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
