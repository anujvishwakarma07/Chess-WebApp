import React from 'react';
import { List } from 'lucide-react';
import { GameState } from '../types/chess';

interface MoveHistoryProps {
  gameState: GameState;
  theme: 'light' | 'dark';
}

export function MoveHistory({ gameState, theme }: MoveHistoryProps) {
  const moves = gameState.moveHistory;
  const movePairs: Array<{ white: string; black?: string; number: number }> = [];

  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      number: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1],
    });
  }

  return (
    <div className={`rounded-2xl border transition-all duration-500 ${
      theme === 'dark' 
        ? 'bg-gray-950 border-gray-800' 
        : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <List className={`w-5 h-5 ${
            theme === 'dark' ? 'text-white' : 'text-black'
          }`} />
          <h3 className={`text-lg font-bold tracking-wide uppercase ${
            theme === 'dark' ? 'text-white' : 'text-black'
          }`}>
            History
          </h3>
        </div>
        
        {/* Move list */}
        <div className="max-h-80 overflow-y-auto">
          {movePairs.length === 0 ? (
            <div className="text-center py-8">
              <p className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                No moves yet
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {movePairs.map((pair, index) => (
                <div
                  key={pair.number}
                  className={`flex items-center p-3 rounded-xl transition-all duration-200 ${
                    index === movePairs.length - 1
                      ? theme === 'dark' 
                        ? 'bg-gray-900 border border-gray-800' 
                        : 'bg-white border border-gray-200'
                      : theme === 'dark' 
                        ? 'hover:bg-gray-900' 
                        : 'hover:bg-white'
                  }`}
                >
                  <span className={`w-8 text-sm font-bold ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    {pair.number}.
                  </span>
                  <div className="flex-1 flex items-center space-x-4">
                    <span className={`font-mono text-sm font-medium px-2 py-1 rounded ${
                      theme === 'dark' 
                        ? 'bg-gray-800 text-white' 
                        : 'bg-gray-200 text-black'
                    }`}>
                      {pair.white}
                    </span>
                    {pair.black && (
                      <span className={`font-mono text-sm font-medium px-2 py-1 rounded ${
                        theme === 'dark' 
                          ? 'bg-gray-700 text-white' 
                          : 'bg-gray-300 text-black'
                      }`}>
                        {pair.black}
                      </span>
                    )}
                  </div>
                  {index === movePairs.length - 1 && (
                    <div className={`w-2 h-2 rounded-full ${
                      theme === 'dark' ? 'bg-white' : 'bg-black'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}