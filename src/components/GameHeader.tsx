import React from 'react';
import { Square } from 'lucide-react';
import { GameSettings } from '../types/chess';

interface GameHeaderProps {
  settings: GameSettings;
}

export function GameHeader({ settings }: GameHeaderProps) {
  return (
    <header className="text-center mb-16">
      <div className="relative inline-block">
        <div className="flex items-center justify-center space-x-4 mb-6">
          <Square className={`w-8 h-8 ${
            settings.theme === 'dark' ? 'text-white' : 'text-black'
          }`} />
          <h1 className={`text-6xl md:text-7xl font-black tracking-tight ${
            settings.theme === 'dark' ? 'text-white' : 'text-black'
          }`}>
            CHESS
          </h1>
          <Square className={`w-8 h-8 ${
            settings.theme === 'dark' ? 'text-white' : 'text-black'
          }`} />
        </div>
        
        <div className={`h-px w-32 mx-auto mb-4 ${
          settings.theme === 'dark' ? 'bg-white' : 'bg-black'
        }`} />
        
        <p className={`text-lg font-medium tracking-wide uppercase ${
          settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Professional Game Platform
        </p>
      </div>
    </header>
  );
}