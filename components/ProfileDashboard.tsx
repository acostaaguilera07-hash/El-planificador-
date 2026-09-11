import React, { useState } from 'react';
import { useProgress } from '../store/ProgressContext';
import { AVATARS } from '../constants';
import {  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

interface ProfileDashboardProps {
  onClose: () => void;
}

export const ProfileDashboard: React.FC<ProfileDashboardProps> = ({ onClose }) => {
  const { user, updateUser, resetProgress } = useProgress();
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(user.name);

  const handleSaveProfile = () => {
    updateUser(tempName, user.avatar);
    setIsEditing(false);
  };

  // Prepare data for chart: Average score per subject
  const subjectStats = user.history.reduce<Record<string, { total: number; count: number }>>((acc, curr) => {
    if (!acc[curr.subject]) {
      acc[curr.subject] = { total: 0, count: 0 };
    }
    acc[curr.subject].total += curr.score;
    acc[curr.subject].count += 1;
    return acc;
  }, {});

  const chartData = Object.entries(subjectStats).map(([key, val]) => {
    // Explicitly type val to avoid 'unknown' type errors in some TS configurations
    const stats = val as { total: number; count: number };
    return {
      name: key.split(' ')[0], // Short name
      score: Math.round(stats.total / stats.count),
    };
  });

  return (
    <div className="space-y-8">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border-t-8 border-purple-400 flex flex-col items-center relative">
        <div className="absolute top-4 right-4">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-xl">✕</button>
        </div>
        
        <div className="w-32 h-32 rounded-full bg-yellow-100 flex items-center justify-center text-7xl border-4 border-yellow-300 mb-4 shadow-inner">
          {user.avatar}
        </div>

        {isEditing ? (
          <div className="flex gap-2 mb-4">
            <input 
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="border-2 border-purple-300 rounded-lg px-3 py-1 text-center font-bold text-xl"
            />
            <button onClick={handleSaveProfile} className="bg-green-500 text-white px-3 rounded-lg">💾</button>
          </div>
        ) : (
          <h2 onClick={() => setIsEditing(true)} className="text-3xl font-bold text-purple-700 cursor-pointer hover:underline mb-2">
            {user.name} ✏️
          </h2>
        )}

        <div className="grid grid-cols-2 gap-8 w-full max-w-sm mt-4">
          <div className="bg-blue-50 p-4 rounded-2xl text-center">
            <p className="text-sm text-blue-600 font-bold uppercase">Nivel</p>
            <p className="text-4xl font-extrabold text-blue-800">{user.level}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-2xl text-center">
            <p className="text-sm text-green-600 font-bold uppercase">XP Total</p>
            <p className="text-4xl font-extrabold text-green-800">{user.xp}</p>
          </div>
        </div>
        
        <div className="mt-6 flex flex-wrap justify-center gap-2">
            <p className="w-full text-center text-sm text-gray-500 mb-2">Cambia tu Avatar:</p>
            {AVATARS.map(av => (
                <button 
                    key={av} 
                    onClick={() => updateUser(user.name, av)}
                    className={`text-2xl p-2 rounded-full hover:bg-gray-100 ${user.avatar === av ? 'bg-yellow-200 scale-110' : ''}`}
                >
                    {av}
                </button>
            ))}
        </div>
      </div>

      {/* Stats Chart */}
      <div className="bg-white rounded-3xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-700 mb-4">📊 Mi Rendimiento</h3>
        {chartData.length > 0 ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#8884d8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#8884d8" fontSize={12} tickLine={false} axisLine={false} hide />
                <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="score" radius={[8, 8, 8, 8]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4ADE80' : '#3B82F6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-center text-gray-400 py-10">Completa simulacros para ver tus estadísticas aquí.</p>
        )}
      </div>

      {/* History List */}
      <div className="bg-white rounded-3xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-700 mb-4">📜 Historial de Simulacros</h3>
        <div className="space-y-3 max-h-80 overflow-y-auto">
            {user.history.length === 0 && <p className="text-center text-gray-400">Aún no hay actividad.</p>}
            {user.history.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                        <p className="font-bold text-gray-800 text-sm">{item.topic}</p>
                        <p className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()} - {item.subject}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${item.score >= 80 ? 'bg-green-100 text-green-700' : item.score >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                        {item.score}%
                    </div>
                </div>
            ))}
        </div>
      </div>
      
      <div className="text-center pt-8">
        <button onClick={resetProgress} className="text-red-400 text-sm underline hover:text-red-600">
            Borrar todo mi progreso
        </button>
      </div>
    </div>
  );
};