import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, QuizResult } from '../types';
import { AVATARS } from '../constants';

interface ProgressContextType {
  user: UserProfile;
  updateUser: (name: string, avatar: string) => void;
  addQuizResult: (result: QuizResult) => void;
  resetProgress: () => void;
}

const defaultUser: UserProfile = {
  name: 'Estudiante',
  avatar: AVATARS[0],
  xp: 0,
  level: 1,
  history: [],
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const savedUser = localStorage.getItem('appsevilla_user_v1');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
    return defaultUser;
  });

  // Save to local storage whenever user changes
  useEffect(() => {
    localStorage.setItem('appsevilla_user_v1', JSON.stringify(user));
  }, [user]);

  const updateUser = (name: string, avatar: string) => {
    setUser(prev => ({ ...prev, name, avatar }));
  };

  const addQuizResult = (result: QuizResult) => {
    setUser(prev => {
      // Calculate XP: 10 points per 10% score + bonus for perfect score
      const points = Math.floor(result.score / 10) * 10 + (result.score === 100 ? 50 : 0);
      const newXp = prev.xp + points;
      const newLevel = Math.floor(newXp / 500) + 1; // Level up every 500 XP

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        history: [result, ...prev.history] // Newest first
      };
    });
  };

  const resetProgress = () => {
    if(window.confirm("¿Estás seguro de querer borrar todo tu progreso?")) {
      setUser(defaultUser);
    }
  };

  return (
    <ProgressContext.Provider value={{ user, updateUser, addQuizResult, resetProgress }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};