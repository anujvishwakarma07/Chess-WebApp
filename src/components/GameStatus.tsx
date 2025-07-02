import React from 'react';
import { Circle, Square, Triangle } from 'lucide-react';
import { GameState, GameSettings } from '../types/chess';

interface GameStatusProps {
  gameState: GameState;
  settings: GameSettings;
  isAiThinking: boolean;
}

export function GameStatus({ gameState, settings, isAiThinking }: GameStatusProps) {
  const getStatusIcon = () => {
    if (gameState.gameStatus === 'checkmate') return <Triangle className="w-5 h-5" />;
    if (gameState.gameStatus === 'stalemate' || gameState.gameStatus === 'draw') return <Square className="w-5 h-5" />;
    return <Circle className="w-5 h-5" />;
  };

  const getStatusText = () => {
    if (gameState.gameStatus === 'checkmate') {
      return `${gameState.winner === 'white' ? 'WHITE' : 'BLACK'} WINS`;
    }
    if (gameState.gameStatus === 'stalemate') return 'STALEMATE';
    if (gameState.gameStatus === 'draw') return 'DRAW';
    if (isAiThinking) return 'AI COMPUTING';
    
    const currentPlayer = gameState.currentPlayer === 'white' ? 'WHITE' : 'BLACK';
    return `${currentPlayer} TO MOVE`;
  };

  return (
    <div className="flex justify-center mb-12">
      <div className={`px-8 py-4 rounded-xl border transition-all duration-300 ${
        settings.theme === 'dark' 
          ? 'bg-gray-950 border-gray-800' 
          : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex items-center space-x-4">
          <div className={`${
            settings.theme === 'dark' ? 'text-white' : 'text-black'
          }`}>
            {getStatusIcon()}
          </div>
          
          <div>
            <h2 className={`text-xl font-bold tracking-wide ${
              settings.theme === 'dark' ? 'text-white' : 'text-black'
            }`}>
              {getStatusText()}
            </h2>
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            <div className="text-center">
              <div className={`text-lg font-bold ${
                settings.theme === 'dark' ? 'text-white' : 'text-black'
              }`}>
                {gameState.moveHistory.length}
              </div>
              <div className={`text-xs font-medium uppercase tracking-wider ${
                settings.theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                Moves
              </div>
            </div>
            
            {settings.gameMode === 'ai' && (
              <div className="text-center">
                <div className={`text-lg font-bold ${
                  settings.theme === 'dark' ? 'text-white' : 'text-black'
                }`}>
                  {settings.aiDifficulty}
                </div>
                <div className={`text-xs font-medium uppercase tracking-wider ${
                  settings.theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  Level
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}