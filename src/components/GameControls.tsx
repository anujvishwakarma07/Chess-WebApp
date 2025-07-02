import React from 'react';
import { 
  RotateCcw, 
  RotateCw, 
  RefreshCw, 
  Sun, 
  Moon, 
  User, 
  Bot,
  Volume2,
  VolumeX,
  Settings
} from 'lucide-react';
import { GameSettings } from '../types/chess';

interface GameControlsProps {
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  isAiThinking: boolean;
  gameStatus: string;
  winner?: string | null;
}

export function GameControls({
  settings,
  onSettingsChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onReset,
  isAiThinking,
  gameStatus,
  winner,
}: GameControlsProps) {
  const toggleTheme = () => {
    onSettingsChange({
      ...settings,
      theme: settings.theme === 'light' ? 'dark' : 'light',
    });
  };

  const toggleGameMode = () => {
    onSettingsChange({
      ...settings,
      gameMode: settings.gameMode === 'local' ? 'ai' : 'local',
    });
  };

  const toggleSound = () => {
    onSettingsChange({
      ...settings,
      soundEnabled: !settings.soundEnabled,
    });
  };

  const adjustAiDifficulty = (difficulty: 1 | 2 | 3 | 4 | 5) => {
    onSettingsChange({
      ...settings,
      aiDifficulty: difficulty,
    });
  };

  const buttonClass = `p-4 rounded-xl transition-all duration-200 border ${
    settings.theme === 'dark'
      ? 'bg-gray-950 border-gray-800 text-white hover:bg-gray-900'
      : 'bg-white border-gray-200 text-black hover:bg-gray-50'
  }`;

  const disabledButtonClass = `p-4 rounded-xl border cursor-not-allowed ${
    settings.theme === 'dark'
      ? 'bg-gray-900 border-gray-800 text-gray-600'
      : 'bg-gray-100 border-gray-200 text-gray-400'
  }`;

  const primaryButtonClass = `p-4 rounded-xl transition-all duration-200 ${
    settings.theme === 'dark'
      ? 'bg-white text-black hover:bg-gray-100'
      : 'bg-black text-white hover:bg-gray-900'
  }`;

  return (
    <div className={`rounded-2xl border transition-all duration-500 ${
      settings.theme === 'dark' 
        ? 'bg-gray-950 border-gray-800' 
        : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <Settings className={`w-5 h-5 ${
            settings.theme === 'dark' ? 'text-white' : 'text-black'
          }`} />
          <h3 className={`text-lg font-bold tracking-wide uppercase ${
            settings.theme === 'dark' ? 'text-white' : 'text-black'
          }`}>
            Controls
          </h3>
        </div>

        {/* Move Controls */}
        <div className="space-y-3">
          <p className={`text-xs font-medium uppercase tracking-wider ${
            settings.theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          }`}>
            Navigation
          </p>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className={canUndo ? buttonClass : disabledButtonClass}
              title="Undo"
            >
              <RotateCcw className="w-5 h-5 mx-auto" />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className={canRedo ? buttonClass : disabledButtonClass}
              title="Redo"
            >
              <RotateCw className="w-5 h-5 mx-auto" />
            </button>
            <button
              onClick={onReset}
              className={primaryButtonClass}
              title="New Game"
            >
              <RefreshCw className="w-5 h-5 mx-auto" />
            </button>
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-3">
          <p className={`text-xs font-medium uppercase tracking-wider ${
            settings.theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          }`}>
            Settings
          </p>
          <div className="space-y-3">
            <button
              onClick={toggleTheme}
              className={buttonClass}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">Theme</span>
                <div className="flex items-center space-x-2">
                  {settings.theme === 'light' ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                </div>
              </div>
            </button>
            
            <button
              onClick={toggleGameMode}
              className={buttonClass}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">Mode</span>
                <div className="flex items-center space-x-2">
                  {settings.gameMode === 'local' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
              </div>
            </button>

            <button
              onClick={toggleSound}
              className={buttonClass}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">Sound</span>
                <div className="flex items-center space-x-2">
                  {settings.soundEnabled ? (
                    <Volume2 className="w-4 h-4" />
                  ) : (
                    <VolumeX className="w-4 h-4" />
                  )}
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* AI Difficulty */}
        {settings.gameMode === 'ai' && (
          <div className="space-y-3">
            <p className={`text-xs font-medium uppercase tracking-wider ${
              settings.theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              AI Level
            </p>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => adjustAiDifficulty(level as 1 | 2 | 3 | 4 | 5)}
                  className={`p-3 rounded-lg text-sm font-bold transition-all duration-200 ${
                    settings.aiDifficulty === level
                      ? settings.theme === 'dark'
                        ? 'bg-white text-black'
                        : 'bg-black text-white'
                      : settings.theme === 'dark'
                        ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Game Status */}
        <div className={`p-4 rounded-xl border ${
          settings.theme === 'dark' 
            ? 'bg-gray-900 border-gray-800' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="text-center">
            {gameStatus === 'playing' ? (
              <div className="space-y-2">
                <div className={`w-2 h-2 rounded-full mx-auto ${
                  isAiThinking ? 'bg-gray-500 animate-pulse' : 'bg-black'
                }`} />
                <span className={`text-sm font-medium ${
                  settings.theme === 'dark' ? 'text-white' : 'text-black'
                }`}>
                  {isAiThinking ? 'AI Computing' : 'Game Active'}
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className={`text-lg font-bold ${
                  settings.theme === 'dark' ? 'text-white' : 'text-black'
                }`}>
                  {gameStatus === 'checkmate' ? 'GAME OVER' : 'DRAW'}
                </div>
                {winner && (
                  <div className={`text-sm font-medium ${
                    settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {winner.toUpperCase()} WINS
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}