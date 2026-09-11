import React, { useState, useEffect } from 'react';
import { generateClassImage } from '../services/geminiService';
import { Subject } from '../types';

interface LazyGeneratedImageProps {
  prompt: string;
  subject?: Subject | null;
  className?: string;
  aspectRatio?: string; // e.g., 'aspect-video' or 'aspect-square'
}

export const LazyGeneratedImage: React.FC<LazyGeneratedImageProps> = ({ prompt, subject, className = "", aspectRatio = "aspect-video" }) => {
  const [src, setSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchImage = async () => {
      // Small random delay to stagger requests if multiple appear at once
      await new Promise(r => setTimeout(r, Math.random() * 500));
      
      const image = await generateClassImage(prompt, subject?.toString() || 'General');
      if (isMounted) {
        setSrc(image);
        setLoading(false);
      }
    };
    fetchImage();
    return () => { isMounted = false; };
  }, [prompt, subject]);

  return (
    <div className={`w-full max-w-md mx-auto my-4 ${className}`}>
      {loading ? (
        <div className={`w-full ${aspectRatio} bg-gray-50 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-blue-200 animate-pulse`}>
            <span className="text-3xl mb-2">🎨</span>
            <span className="text-blue-400 font-bold text-xs uppercase tracking-wide">Dibujando...</span>
        </div>
      ) : src ? (
        <div className="relative group transform hover:scale-[1.01] transition-transform duration-300">
             <div className="absolute inset-0 bg-black/5 translate-x-1 translate-y-1 rounded-xl"></div>
             <img src={src} alt={prompt} referrerPolicy="no-referrer" className={`relative w-full rounded-xl shadow-md border-2 border-white object-cover ${aspectRatio}`} />
        </div>
      ) : null}
    </div>
  );
};