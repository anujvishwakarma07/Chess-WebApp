import React from 'react';
import { User, Bot, Circle } from 'lucide-react';
import { GameState, GameSettings } from '../types/chess';

interface PlayerInfoProps {
  settings: GameSettings;
  gameState: GameState;
  isTopPlayer: boolean;
}

export function PlayerInfo({ settings, gameState, isTopPlayer }: PlayerInfoProps) {
  const isWhitePlayer = isTopPlayer;
  const isCurrentPlayer = (isWhitePlayer && gameState.currentPlayer === 'white') || 
                         (!isWhitePlayer && gameState.currentPlayer === 'black');
  
  const playerName = isWhitePlayer ? 'WHITE' : 'BLACK';
  const isAI = settings.gameMode === 'ai' && !isWhitePlayer;
  const isWinner = gameState.winner === (isWhitePlayer ? 'white' : 'black');

  const playerMoves = Math.ceil(gameState.moveHistory.length / 2);

  return (
    <div className={`p-6 rounded-2xl border transition-all duration-500 ${
      settings.theme === 'dark' 
        ? 'bg-gray-950 border-gray-800' 
        : 'bg-gray-50 border-gray-200'
    } ${isCurrentPlayer && gameState.gameStatus === 'playing' 
      ? settings.theme === 'dark'
        ? 'ring-1 ring-white' 
        : 'ring-1 ring-black'
      : ''
    } ${isWinner 
      ? settings.theme === 'dark'
        ? 'ring-1 ring-white' 
        : 'ring-1 ring-black'
      : ''
    }`}>
      
      {/* Player Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-xl ${
            isWhitePlayer 
              ? settings.theme === 'dark' ? 'bg-white text-black' : 'bg-gray-200 text-black'
              : settings.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-black text-white'
          }`}>
            {isAI ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
          </div>
          
          <div>
            <h3 className={`text-lg font-bold tracking-wide ${
              settings.theme === 'dark' ? 'text-white' : 'text-black'
            }`}>
              {playerName}
            </h3>
            <p className={`text-xs font-medium uppercase tracking-wider ${
              settings.theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              {isAI ? `AI Level ${settings.aiDifficulty}` : 'Human'}
            </p>
          </div>
        </div>
        
        {isCurrentPlayer && gameState.gameStatus === 'playing' && (
          <Circle className={`w-3 h-3 fill-current ${
            settings.theme === 'dark' ? 'text-white' : 'text-black'
          }`} />
        )}
      </div>

      {/* Player Statistics */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`p-4 rounded-xl border ${
          settings.theme === 'dark' 
            ? 'bg-gray-900 border-gray-800' 
            : 'bg-white border-gray-200'
        }`}>
          <div className={`text-2xl font-bold mb-1 ${
            settings.theme === 'dark' ? 'text-white' : 'text-black'
          }`}>
            {playerMoves}
          </div>
          <div className={`text-xs font-medium uppercase tracking-wider ${
            settings.theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          }`}>
            Moves
          </div>
        </div>
        
        <div className={`p-4 rounded-xl border ${
          settings.theme === 'dark' 
            ? 'bg-gray-900 border-gray-800' 
            : 'bg-white border-gray-200'
        }`}>
          <div className={`text-2xl font-bold mb-1 ${
            settings.theme === 'dark' ? 'text-white' : 'text-black'
          }`}>
            0
          </div>
          <div className={`text-xs font-medium uppercase tracking-wider ${
            settings.theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          }`}>
            Captures
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="mt-6 text-center">
        {gameState.gameStatus === 'playing' ? (
          isCurrentPlayer ? (
            <div className={`text-sm font-medium ${
              settings.theme === 'dark' ? 'text-white' : 'text-black'
            }`}>
              ACTIVE TURN
            </div>
          ) : (
            <div className={`text-sm font-medium ${
              settings.theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              WAITING
            </div>
          )
        ) : isWinner ? (
          <div className={`text-sm font-bold ${
            settings.theme === 'dark' ? 'text-white' : 'text-black'
          }`}>
            WINNER
          </div>
        ) : (
          <div className={`text-sm font-medium ${
            settings.theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          }`}>
            GAME ENDED
          </div>
        )}
      </div>
    </div>
  );
}