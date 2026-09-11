
import React, { useState } from 'react';
import { ProgressProvider, useProgress } from './store/ProgressContext';
import { Layout } from './components/Layout';
import { TheoryViewer } from './components/TheoryViewer';
import { Quiz } from './components/Quiz';
import { ProfileDashboard } from './components/ProfileDashboard';
import { generateTheory, generateMultigradeTheory, generateQuiz, generateClassImage } from './services/geminiService';
import { ViewState, Grade, Subject, Difficulty, QuizQuestion, QuizResult } from './types';
import { GRADES, SUBJECTS, TOPICS } from './constants';

const MainApp = () => {
  const { addQuizResult } = useProgress();
  const [view, setView] = useState<ViewState>('HOME');
  const [isMultigrade, setIsMultigrade] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [selectedGrades, setSelectedGrades] = useState<Grade[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [customTopic, setCustomTopic] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [theoryContent, setTheoryContent] = useState<string>('');
  const [theoryImage, setTheoryImage] = useState<string | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastScore, setLastScore] = useState<{
      score: number, 
      total: number, 
      breakdown: Record<string, { correct: number; total: number }>
  } | null>(null);

  const goBack = () => {
    if (view === 'QUIZ' && lastScore) {
        setView('TOPIC_SELECT'); 
        setLastScore(null);
        return;
    }
    if (view === 'PROFILE' || view === 'ABOUT') {
      setView('HOME');
      return;
    }
    if (view === 'SUBJECT_SELECT') {
        setSelectedGrades([]);
        setSelectedGrade(null);
        setView('HOME');
        return;
    }
    if (view === 'TOPIC_SELECT') {
        setView('SUBJECT_SELECT');
        return;
    }
    if (view === 'THEORY') {
        setView('TOPIC_SELECT');
        return;
    }
    if (view === 'QUIZ') {
        setView('THEORY');
        return;
    }
  };

  const goHome = () => {
      setView('HOME');
      setLastScore(null);
  };

  const handleGradeSelect = (grade: Grade) => {
    if (isMultigrade) {
      setSelectedGrades(prev => 
        prev.includes(grade) ? prev.filter(g => g !== grade) : [...prev, grade]
      );
    } else {
      setSelectedGrade(grade);
      setSelectedGrades([grade]);
      setView('SUBJECT_SELECT');
    }
  };

  const startMultigradeSubjectSelect = () => {
    if (selectedGrades.length === 0) return;
    setView('SUBJECT_SELECT');
  };

  const handleSubjectSelect = (subject: Subject) => {
    setSelectedSubject(subject);
    setView('TOPIC_SELECT');
  };

  const handleTopicSelect = async (topic: string) => {
    const finalTopic = topic.trim();
    if (!finalTopic) return;
    
    setSelectedTopic(finalTopic);
    setView('THEORY');
    setIsLoading(true);
    setTheoryContent('');
    setTheoryImage(null);
    
    if (selectedGrades.length > 0 && selectedSubject) {
      try {
        const [content, image] = await Promise.all([
          selectedGrades.length > 1 
            ? generateMultigradeTheory(selectedGrades, selectedSubject, finalTopic)
            : generateTheory(selectedGrades[0], selectedSubject, finalTopic),
          generateClassImage(finalTopic, selectedSubject)
        ]);
        setTheoryContent(content);
        setTheoryImage(image);
      } catch (error) {
        setTheoryContent("¡Ups! Hubo un error cargando la aventura educativa.");
      }
    }
    setIsLoading(false);
  };

  const startQuiz = async (difficulty: Difficulty = Difficulty.EASY) => {
    setSelectedDifficulty(difficulty);
    setView('QUIZ');
    setIsLoading(true);
    setQuizQuestions([]);
    setLastScore(null);

    if (selectedGrades.length > 0 && selectedSubject && selectedTopic) {
      const questions = await generateQuiz(selectedGrades[0], selectedSubject, selectedTopic, difficulty);
      setQuizQuestions(questions);
    }
    setIsLoading(false);
  };

  const handleQuizComplete = (correct: number, total: number, breakdown: Record<string, { correct: number; total: number }>) => {
    const percentage = Math.round((correct / total) * 100);
    setLastScore({ score: correct, total, breakdown });
    
    const result: QuizResult = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      grade: selectedGrades[0] || Grade.FIRST,
      subject: selectedSubject!,
      topic: selectedTopic!,
      score: percentage,
      totalQuestions: total,
      correctAnswers: correct,
      difficulty: selectedDifficulty
    };
    addQuizResult(result);
  };

  const renderHome = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-scale-in">
      <div className="sm:col-span-2 lg:col-span-3 text-center mb-4">
        <h2 className="text-4xl md:text-5xl font-black text-indigo-900 mb-2">NATSEVILLA 3.0 🚀</h2>
        <p className="text-xl text-indigo-600 font-medium">¿Listo para explorar el conocimiento?</p>
      </div>

      <div className="sm:col-span-2 lg:col-span-3 flex justify-center mb-4">
        <button 
          onClick={() => {
            setIsMultigrade(!isMultigrade);
            setSelectedGrades([]);
          }}
          className={`flex items-center gap-3 px-8 py-4 rounded-full font-black transition-all shadow-lg ${isMultigrade ? 'bg-indigo-600 text-white ring-4 ring-indigo-200' : 'bg-white text-indigo-600 border-2 border-indigo-100'}`}
        >
          <span className="text-2xl">{isMultigrade ? '✅' : '⬜'}</span>
          <span className="uppercase tracking-tight">Modo Multigrado</span>
        </button>
      </div>
      
      <button
          onClick={() => setView('ABOUT')}
          className="bg-indigo-600 text-white p-8 rounded-[2.5rem] shadow-xl transform hover:-translate-y-2 transition-all flex flex-col items-center justify-center gap-4 group col-span-1 sm:col-span-2 lg:col-span-1 border-b-8 border-indigo-800"
      >
          <span className="text-6xl group-hover:bounce transition-transform">✨</span>
          <span className="text-2xl font-black text-center uppercase tracking-tight">Conoce la App</span>
          <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-bold">HISTORIA Y DISEÑO</span>
      </button>

      {GRADES.map((g) => {
        const isSelected = selectedGrades.includes(g.id);
        return (
          <button
            key={g.id}
            onClick={() => handleGradeSelect(g.id)}
            className={`${g.color} text-white p-8 rounded-[2.5rem] shadow-xl transform hover:-translate-y-2 transition-all flex flex-col items-center justify-center gap-4 group border-b-8 border-black/20 relative overflow-hidden`}
          >
            {isMultigrade && isSelected && (
              <div className="absolute top-4 right-4 bg-white text-indigo-600 w-10 h-10 rounded-full flex items-center justify-center font-black shadow-md animate-scale-in">
                ✓
              </div>
            )}
            <span className="text-6xl group-hover:scale-110 transition-transform">{g.icon}</span>
            <span className="text-3xl font-black uppercase tracking-tighter">{g.label}</span>
            <span className="text-sm bg-white/20 px-4 py-1 rounded-full font-bold">{g.id}</span>
          </button>
        );
      })}

      {isMultigrade && selectedGrades.length > 0 && (
        <div className="sm:col-span-2 lg:col-span-3 flex justify-center mt-4 animate-fade-in-up">
          <button 
            onClick={startMultigradeSubjectSelect}
            className="bg-pink-500 hover:bg-pink-600 text-white px-12 py-5 rounded-full font-black text-2xl shadow-2xl hover:scale-105 transition-all uppercase tracking-widest border-b-8 border-pink-800"
          >
            Continuar con {selectedGrades.length} {selectedGrades.length === 1 ? 'Grado' : 'Grados'} 🚀
          </button>
        </div>
      )}
    </div>
  );

  const renderAbout = () => (
    <div className="space-y-8 animate-fade-in">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-t-8 border-indigo-500 relative overflow-hidden">
            <div className="text-center mb-10">
                <span className="text-7xl block mb-4">🌟</span>
                <h2 className="text-4xl font-black text-indigo-800 leading-tight">Nuestra Misión Educativa</h2>
            </div>
            
            <p className="text-2xl text-gray-700 text-center leading-relaxed mb-10 font-medium">
                <strong>Explora y Aprende con NATSEVILLA 3.0</strong> es una herramienta educativa diseñada con el propósito para potenciar el aprendizaje de los niños y niñas de básica primaria.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { icon: '🇨🇴', title: 'DBA Colombia', desc: 'Alineado 100% con el Ministerio de Educación Nacional.', color: 'bg-blue-50 border-blue-400' },
                  { icon: '📝', title: 'Pruebas SABER', desc: 'Simulacros por competencias para entrenamiento ICFES.', color: 'bg-yellow-50 border-yellow-400' },
                  { icon: '🤖', title: 'IA Generativa', desc: 'Temas infinitos y clases creadas al instante por Gemini.', color: 'bg-green-50 border-green-400' },
                  { icon: '🎨', title: 'Magia Visual', desc: 'Ilustraciones artísticas para cada tema complejo.', color: 'bg-pink-50 border-pink-400' },
                ].map((item, i) => (
                  <div key={i} className={`${item.color} p-6 rounded-3xl border-l-8 flex gap-4 items-center`}>
                    <span className="text-4xl">{item.icon}</span>
                    <div>
                        <h3 className="font-black text-gray-800 text-xl">{item.title}</h3>
                        <p className="text-gray-600 text-sm leading-tight">{item.desc}</p>
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-12 flex flex-col items-center justify-center p-8 bg-indigo-50 rounded-[2rem] border-2 border-indigo-100 shadow-inner">
                <span className="text-5xl mb-3">👨‍🏫</span>
                <p className="text-xs text-indigo-500 font-black uppercase tracking-widest mb-1">Diseñador y Pedagogo</p>
                <h3 className="text-3xl font-black text-indigo-900 text-center">Miguel Sevilla Hernandez</h3>
            </div>

            <div className="mt-10 text-center">
                <button 
                    onClick={() => setView('HOME')}
                    className="bg-pink-500 hover:bg-pink-600 text-white font-black py-4 px-12 rounded-full shadow-lg hover:scale-105 transition-all text-xl uppercase tracking-wider"
                >
                    ¡Empezar Aventura! ✨
                </button>
            </div>
        </div>
    </div>
  );

  const renderSubjectSelect = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-black text-gray-800 mb-2 uppercase">Selecciona tu Materia</h2>
        <div className="flex flex-wrap justify-center gap-2">
          {selectedGrades.map(g => (
            <div key={g} className="bg-indigo-600 text-white px-4 py-1 rounded-full font-bold text-sm">{g}</div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        {SUBJECTS.map((s) => (
          <button
            key={s.id}
            onClick={() => handleSubjectSelect(s.id)}
            className={`${s.color} text-white p-8 rounded-[2rem] shadow-xl hover:scale-[1.03] transition-all flex flex-col items-center justify-center gap-3 h-48 border-b-8 border-black/10`}
          >
            <span className="text-6xl">{s.icon}</span>
            <span className="text-2xl font-black uppercase tracking-tighter">{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderTopicSelect = () => {
    if (!selectedSubject) return null;
    const topics = TOPICS[selectedSubject];
    
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="text-center">
            <h2 className="text-3xl font-black text-gray-800 uppercase">¿Qué aprenderemos?</h2>
            <p className="text-lg text-indigo-600 font-bold">{selectedSubject}</p>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-xl border-4 border-indigo-400 relative">
            <div className="absolute -top-4 left-6 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">Aventura Personalizada</div>
            <p className="text-gray-700 font-bold mb-4">Escribe el tema que quieras desarrollar hoy:</p>
            <div className="flex flex-col sm:flex-row gap-3">
                <input 
                    type="text" 
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="Ej: Los dinosaurios, Las sumas, El espacio..."
                    className="flex-1 px-6 py-4 rounded-2xl bg-indigo-50 border-2 border-indigo-200 focus:border-indigo-500 focus:ring-0 text-indigo-900 font-bold placeholder-indigo-300"
                />
                <button 
                    onClick={() => handleTopicSelect(customTopic)}
                    disabled={!customTopic.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white px-8 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                    <span>🪄</span> CREAR CLASE
                </button>
            </div>
        </div>

        <div className="flex items-center gap-4 my-8">
            <div className="h-0.5 flex-1 bg-indigo-200"></div>
            <span className="text-indigo-400 font-black text-sm uppercase tracking-widest">O elige uno sugerido</span>
            <div className="h-0.5 flex-1 bg-indigo-200"></div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {topics.map((topic, idx) => (
            <button
              key={idx}
              onClick={() => handleTopicSelect(topic)}
              className="bg-white border-l-[12px] border-indigo-500 p-6 rounded-2xl shadow-md hover:bg-indigo-50 text-left transition-all flex justify-between items-center group"
            >
              <span className="text-xl font-black text-gray-700 group-hover:text-indigo-600">{topic}</span>
              <span className="text-3xl opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all">👉</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderTheory = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-3xl font-black text-indigo-900 leading-tight">{selectedTopic}</h2>
           <div className="flex flex-wrap gap-2 mt-1">
                {selectedGrades.map(g => (
                  <span key={g} className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-black uppercase">{g}</span>
                ))}
                <span className="text-[10px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-black uppercase">{selectedSubject}</span>
           </div>
        </div>
      </div>
      <TheoryViewer 
        content={theoryContent} 
        imageSrc={theoryImage}
        isLoading={isLoading} 
        onStartQuiz={(diff) => startQuiz(diff)} 
        subject={selectedSubject}
        grade={selectedGrades[0]}
      />
    </>
  );

  const renderQuiz = () => {
      if (lastScore) {
          return (
              <div className="flex flex-col items-center gap-8 animate-fade-in-up">
                  <div className="bg-white rounded-[3rem] p-10 text-center shadow-2xl w-full max-w-lg border-b-8 border-indigo-100">
                      <div className="text-9xl mb-8 animate-bounce">
                          {lastScore.score === lastScore.total ? '👑' : lastScore.score > lastScore.total / 2 ? '🎈' : '⚡'}
                      </div>
                      <h2 className="text-4xl font-black text-indigo-900 mb-2">
                          {lastScore.score === lastScore.total ? '¡ERES UN GENIO!' : '¡MUY BUEN INTENTO!'}
                      </h2>
                      <p className="text-2xl text-gray-500 mb-6">
                          Aciertos: <span className="text-pink-600 font-black">{lastScore.score} / {lastScore.total}</span>
                      </p>
                      
                      <div className="space-y-4">
                         {Object.entries(lastScore.breakdown).map(([comp, stats]) => {
                             const s = stats as { correct: number; total: number };
                             const pct = (s.correct / s.total) * 100;
                             return (
                                 <div key={comp} className="bg-gray-50 p-4 rounded-2xl">
                                     <div className="flex justify-between text-xs font-black text-gray-600 mb-1 uppercase tracking-tighter">
                                         <span>{comp}</span>
                                         <span>{s.correct}/{s.total}</span>
                                     </div>
                                     <div className="h-4 w-full bg-white rounded-full overflow-hidden border-2 border-gray-200 shadow-inner">
                                         <div className={`h-full transition-all duration-1000 ${pct > 60 ? 'bg-green-500' : pct > 30 ? 'bg-yellow-400' : 'bg-red-500'}`} style={{ width: `${pct}%` }}></div>
                                     </div>
                                 </div>
                             )
                         })}
                      </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-lg">
                      <button onClick={() => startQuiz(selectedDifficulty)} className="flex-1 bg-yellow-400 text-yellow-900 font-black py-5 px-8 rounded-3xl hover:bg-yellow-500 transition shadow-lg text-xl uppercase tracking-tighter">
                          Repetir Reto
                      </button>
                      <button onClick={() => setView('TOPIC_SELECT')} className="flex-1 bg-indigo-600 text-white font-black py-5 px-8 rounded-3xl hover:bg-indigo-700 transition shadow-lg text-xl uppercase tracking-tighter">
                          Cambiar Tema
                      </button>
                  </div>
              </div>
          )
      }
      return (
        <Quiz 
            questions={quizQuestions} 
            isLoading={isLoading} 
            onComplete={handleQuizComplete} 
            onRetry={() => startQuiz(selectedDifficulty)}
            grade={selectedGrades[0]}
            subject={selectedSubject}
            topic={selectedTopic}
        />
      );
  }

  const getTitle = () => {
      switch(view) {
          case 'ABOUT': return 'Sobre NATSEVILLA 3.0';
          case 'SUBJECT_SELECT': return 'Elegir Materia';
          case 'TOPIC_SELECT': return 'Elegir Tema';
          case 'THEORY': return 'Hora de la Clase';
          case 'QUIZ': return 'Reto SABER';
          case 'PROFILE': return 'Mi Tablero';
          default: return 'NATSEVILLA 3.0';
      }
  }

  return (
    <Layout 
        title={getTitle()} 
        onBack={view !== 'HOME' ? goBack : undefined}
        onHome={view !== 'HOME' ? goHome : undefined}
        backLabel={view === 'ABOUT' ? 'Inicio' : 'Volver'}
        showProfile={() => setView('PROFILE')}
    >
      {view === 'HOME' && renderHome()}
      {view === 'ABOUT' && renderAbout()}
      {view === 'SUBJECT_SELECT' && renderSubjectSelect()}
      {view === 'TOPIC_SELECT' && renderTopicSelect()}
      {view === 'THEORY' && renderTheory()}
      {view === 'QUIZ' && renderQuiz()}
      {view === 'PROFILE' && <ProfileDashboard onClose={() => setView('HOME')} />}
    </Layout>
  );
};

const App = () => {
    return (
        <ProgressProvider>
            <MainApp />
        </ProgressProvider>
    )
}

export default App;
