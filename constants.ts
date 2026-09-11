
import { Grade, Subject } from './types';

export const GRADES = [
  { id: Grade.FIRST, label: '1°', color: 'bg-red-400', icon: '🎈' },
  { id: Grade.SECOND, label: '2°', color: 'bg-orange-400', icon: '🪁' },
  { id: Grade.THIRD, label: '3°', color: 'bg-yellow-400', icon: '🎨' },
  { id: Grade.FOURTH, label: '4°', color: 'bg-green-400', icon: '🚀' },
  { id: Grade.FIFTH, label: '5°', color: 'bg-blue-400', icon: '🪐' },
];

export const SUBJECTS = [
  { id: Subject.MATH, label: 'Matemáticas', color: 'bg-blue-500', icon: '📐' },
  { id: Subject.LANGUAGE, label: 'Lenguaje', color: 'bg-pink-500', icon: '📚' },
  { id: Subject.SCIENCE, label: 'Ciencias', color: 'bg-green-500', icon: '🌱' },
  { id: Subject.SOCIAL, label: 'Sociales', color: 'bg-yellow-600', icon: '🌍' },
  { id: Subject.ARTS, label: 'Artística', color: 'bg-purple-500', icon: '🎨' },
  { id: Subject.RELIGION, label: 'Religión', color: 'bg-amber-500', icon: '🕊️' },
  { id: Subject.PHYSICAL_ED, label: 'Ed. Física', color: 'bg-orange-600', icon: '🏀' },
  { id: Subject.ETHICS, label: 'Ética', color: 'bg-teal-500', icon: '💖' },
  { id: Subject.ENGLISH, label: 'Inglés', color: 'bg-sky-500', icon: '🇬🇧' },
];

export const TOPICS: Record<Subject, string[]> = {
  [Subject.MATH]: [
    'Operaciones Básicas (Suma, Resta)',
    'Geometría y Figuras',
    'Medición y Datos',
    'Pensamiento Numérico',
    'Resolución de Problemas'
  ],
  [Subject.LANGUAGE]: [
    'Comprensión Lectora',
    'Producción Textual',
    'Gramática y Ortografía',
    'Literatura y Cuentos',
    'Medios de Comunicación'
  ],
  [Subject.SCIENCE]: [
    'Seres Vivos y Entorno',
    'Materia y Energía',
    'Ciencia, Tecnología y Sociedad',
    'El Cuerpo Humano',
    'Ecología'
  ],
  [Subject.SOCIAL]: [
    'Historia de Colombia',
    'Geografía y Mapas',
    'Democracia y Convivencia',
    'Culturas y Tradiciones',
    'El Universo y la Tierra'
  ],
  [Subject.ARTS]: [
    'Dibujo y Pintura',
    'Expresión Corporal',
    'Manualidades con Material Reciclado',
    'Colores Primarios y Secundarios',
    'Grandes Artistas de la Historia'
  ],
  [Subject.RELIGION]: [
    'Valores Espirituales',
    'Respeto por la Creación',
    'Grandes Historias de Fe',
    'Convivencia y Paz',
    'Tradiciones Religiosas'
  ],
  [Subject.PHYSICAL_ED]: [
    'Motricidad y Coordinación',
    'Juegos y Rondas Tradicionales',
    'Hábitos de Vida Saludable',
    'Deportes y Trabajo en Equipo',
    'Expresión Rítmica'
  ],
  [Subject.ETHICS]: [
    'Los Valores en la Familia',
    'Resolución Pacífica de Conflictos',
    'Autoestima y Cuidado Personal',
    'Honestidad y Responsabilidad',
    'Respeto por la Diversidad'
  ],
  [Subject.ENGLISH]: [
    'Greetings and Farewells',
    'Colors and Numbers',
    'My Family and Home',
    'Animals and Nature',
    'Daily Routines'
  ],
};

export const AVATARS = [
  '🐶', '🐱', '🦁', '🐯', '🐨', '🐼', '🐸', '🦄', '🤖', '👽'
];
