import React, { useCallback, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { useChessGame } from '../hooks/useChessGame';
import { MoveHistory } from './MoveHistory';
import { GameControls } from './GameControls';
import { GameStatus } from './GameStatus';
import { PlayerInfo } from './PlayerInfo';
import { GameHeader } from './GameHeader';

export function ChessGame() {
  const {
    gameState,
    settings,
    chess,
    isAiThinking,
    canUndo,
    canRedo,
    makeMove,
    undoMove,
    redoMove,
    resetGame,
    setSettings,
  } = useChessGame();

  const [boardSize, setBoardSize] = useState(600);

  const onDrop = useCallback((sourceSquare: string, targetSquare: string) => {
    // Prevent moves during AI thinking or when game is over
    if (isAiThinking || gameState.gameStatus !== 'playing') {
      return false;
    }

    // In AI mode, prevent moves when it's black's turn (AI's turn)
    if (settings.gameMode === 'ai' && chess.turn() === 'b') {
      return false;
    }

    // Attempt to make the move
    return makeMove({ from: sourceSquare, to: targetSquare });
  }, [makeMove, isAiThinking, gameState.gameStatus, settings.gameMode, chess]);

  const onPieceClick = useCallback((piece: string, square: string) => {
    // Handle piece selection for mobile or click-to-move
    console.log('Piece clicked:', piece, 'on square:', square);
  }, []);

  const onSquareClick = useCallback((square: string) => {
    // Handle square clicks for move selection
    console.log('Square clicked:', square);
  }, []);

  const boardOrientation = settings.gameMode === 'ai' ? 'white' : 'white';

  React.useEffect(() => {
    const updateBoardSize = () => {
      const maxSize = Math.min(window.innerWidth * 0.55, window.innerHeight * 0.75, 650);
      setBoardSize(Math.max(320, maxSize));
    };

    updateBoardSize();
    window.addEventListener('resize', updateBoardSize);
    return () => window.removeEventListener('resize', updateBoardSize);
  }, []);

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      settings.theme === 'dark' 
        ? 'bg-black' 
        : 'bg-white'
    }`}>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className={`w-full h-full ${
          settings.theme === 'dark' ? 'bg-white' : 'bg-black'
        }`} style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12 max-w-7xl">
        <GameHeader settings={settings} />
        
        <GameStatus 
          gameState={gameState}
          settings={settings}
          isAiThinking={isAiThinking}
        />

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mt-12">
          {/* Left Sidebar - Player Info & Stats */}
          <div className="xl:col-span-3 space-y-6 order-3 xl:order-1">
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <PlayerInfo 
                settings={settings}
                gameState={gameState}
                isTopPlayer={true}
              />
            </div>
            
            <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <MoveHistory 
                gameState={gameState} 
                theme={settings.theme}
              />
            </div>
          </div>

          {/* Center - Chess Board */}
          <div className="xl:col-span-6 flex justify-center order-1 xl:order-2">
            <div className="w-full max-w-4xl animate-scale-in">
              <div className={`p-8 rounded-2xl border transition-all duration-500 ${
                settings.theme === 'dark' 
                  ? 'bg-gray-950 border-gray-800' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="relative group">
                  {/* Minimal accent line */}
                  <div className={`absolute -top-4 left-0 right-0 h-1 rounded-full ${
                    gameState.gameStatus === 'playing' 
                      ? 'bg-black' 
                      : 'bg-gray-400'
                  }`} />
                  
                  <div className="relative">
                    <Chessboard
                      position={gameState.fen}
                      onPieceDrop={onDrop}
                      onPieceClick={onPieceClick}
                      onSquareClick={onSquareClick}
                      boardOrientation={boardOrientation}
                      customBoardStyle={{
                        borderRadius: '12px',
                        boxShadow: settings.theme === 'dark' 
                          ? '0 20px 40px rgba(0, 0, 0, 0.5)'
                          : '0 20px 40px rgba(0, 0, 0, 0.1)',
                        border: settings.theme === 'dark' 
                          ? '1px solid #1f2937' 
                          : '1px solid #e5e7eb',
                      }}
                      customDarkSquareStyle={{
                        backgroundColor: settings.theme === 'dark' ? '#1f2937' : '#374151',
                      }}
                      customLightSquareStyle={{
                        backgroundColor: settings.theme === 'dark' ? '#f9fafb' : '#ffffff',
                      }}
                      customDropSquareStyle={{
                        boxShadow: 'inset 0 0 1px 4px #000000',
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                      }}
                      customPremoveSquareStyle={{
                        boxShadow: 'inset 0 0 1px 4px #6b7280',
                        backgroundColor: 'rgba(107, 114, 128, 0.1)',
                      }}
                      animationDuration={200}
                      areArrowsAllowed={false}
                      arePiecesDraggable={gameState.gameStatus === 'playing' && !isAiThinking}
                      boardWidth={boardSize}
                      showBoardNotation={true}
                      customPieceStyle={{
                        cursor: gameState.gameStatus === 'playing' && !isAiThinking ? 'grab' : 'default',
                      }}
                      isDraggablePiece={({ piece, sourceSquare }) => {
                        // Only allow dragging if game is active and not AI thinking
                        if (gameState.gameStatus !== 'playing' || isAiThinking) return false;
                        
                        // In AI mode, only allow white pieces to be dragged
                        if (settings.gameMode === 'ai' && chess.turn() === 'b') return false;
                        
                        // Only allow current player's pieces to be dragged
                        return chess.turn() === piece[0];
                      }}
                      onPieceDragBegin={(piece, sourceSquare) => {
                        console.log('Drag begin:', piece, sourceSquare);
                      }}
                      onPieceDragEnd={(piece, sourceSquare) => {
                        console.log('Drag end:', piece, sourceSquare);
                      }}
                    />
                    
                    {/* AI Thinking Overlay */}
                    {isAiThinking && (
                      <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center">
                        <div className={`px-6 py-4 rounded-xl border ${
                          settings.theme === 'dark' 
                            ? 'bg-gray-950 border-gray-800 text-white' 
                            : 'bg-white border-gray-200 text-black'
                        }`}>
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-black rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-black rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                            <span className="ml-3 font-medium">AI Computing</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Controls & Bottom Player */}
          <div className="xl:col-span-3 space-y-6 order-2 xl:order-3">
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <GameControls
                settings={settings}
                onSettingsChange={setSettings}
                canUndo={canUndo}
                canRedo={canRedo}
                onUndo={undoMove}
                onRedo={redoMove}
                onReset={resetGame}
                isAiThinking={isAiThinking}
                gameStatus={gameState.gameStatus}
                winner={gameState.winner}
              />
            </div>
            
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <PlayerInfo 
                settings={settings}
                gameState={gameState}
                isTopPlayer={false}
              />
            </div>
          </div>
        </div>

        {/* Minimal Footer */}
        <footer className={`text-center mt-20 ${
          settings.theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
        }`}>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-1 h-1 bg-current rounded-full"></div>
            <span className="text-sm font-medium">Professional Chess Platform</span>
            <div className="w-1 h-1 bg-current rounded-full"></div>
          </div>
        </footer>
      </div>
    </div>
  );
}