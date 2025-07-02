import { useState, useCallback, useEffect } from 'react';
import { Chess } from 'chess.js';
import { GameState, GameSettings, ChessMove } from '../types/chess';
import { useLocalStorage } from './useLocalStorage';
import { playMoveSound, playCaptureSound } from '../utils/sounds';

const STORAGE_KEY = 'chess-game-state';
const SETTINGS_KEY = 'chess-game-settings';

export function useChessGame() {
  const [gameState, setGameState] = useLocalStorage<GameState>(STORAGE_KEY, {
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    pgn: '',
    moveHistory: [],
    currentPlayer: 'white',
    gameStatus: 'playing',
    winner: null,
  });

  const [settings, setSettings] = useLocalStorage<GameSettings>(SETTINGS_KEY, {
    theme: 'light',
    gameMode: 'local',
    aiDifficulty: 3,
    soundEnabled: true,
  });

  const [chess] = useState(() => new Chess());
  const [gameHistory, setGameHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Initialize chess position from saved state
  useEffect(() => {
    try {
      if (gameState.fen && gameState.fen !== chess.fen()) {
        chess.load(gameState.fen);
      }
      if (gameState.moveHistory.length > 0) {
        setGameHistory(gameState.moveHistory);
        setHistoryIndex(gameState.moveHistory.length - 1);
      }
    } catch (error) {
      console.error('Error loading saved game state:', error);
      // Reset to initial position if there's an error
      chess.reset();
      updateGameState();
    }
  }, []);

  // Enhanced AI with different difficulty levels
  const calculateAIMove = useCallback(async (): Promise<string | null> => {
    return new Promise((resolve) => {
      setIsAiThinking(true);
      
      // Simulate thinking time based on difficulty
      const thinkingTime = 300 + (settings.aiDifficulty * 200) + Math.random() * 500;
      
      setTimeout(() => {
        const possibleMoves = chess.moves();
        if (possibleMoves.length === 0) {
          setIsAiThinking(false);
          resolve(null);
          return;
        }

        let selectedMove: string;

        // AI logic based on difficulty
        switch (settings.aiDifficulty) {
          case 1: // Beginner - Random moves
            selectedMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            break;
            
          case 2: // Easy - Prefer captures
            const captures = possibleMoves.filter(move => move.includes('x'));
            selectedMove = captures.length > 0 && Math.random() > 0.3
              ? captures[Math.floor(Math.random() * captures.length)]
              : possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            break;
            
          case 3: // Medium - Captures and checks
            const capturesAndChecks = possibleMoves.filter(move => 
              move.includes('x') || move.includes('+')
            );
            selectedMove = capturesAndChecks.length > 0 && Math.random() > 0.4
              ? capturesAndChecks[Math.floor(Math.random() * capturesAndChecks.length)]
              : possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            break;
            
          case 4: // Hard - Strategic moves
            const strategicMoves = possibleMoves.filter(move => {
              const testChess = new Chess(chess.fen());
              testChess.move(move);
              return testChess.inCheck() || move.includes('x') || move.includes('+');
            });
            selectedMove = strategicMoves.length > 0 && Math.random() > 0.2
              ? strategicMoves[Math.floor(Math.random() * strategicMoves.length)]
              : possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            break;
            
          case 5: // Expert - Best available moves
            const expertMoves = possibleMoves.filter(move => {
              const testChess = new Chess(chess.fen());
              const moveObj = testChess.move(move);
              return moveObj && (moveObj.captured || testChess.inCheck() || move.includes('+'));
            });
            selectedMove = expertMoves.length > 0
              ? expertMoves[Math.floor(Math.random() * expertMoves.length)]
              : possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            break;
            
          default:
            selectedMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        }
        
        setIsAiThinking(false);
        resolve(selectedMove);
      }, thinkingTime);
    });
  }, [chess, settings.aiDifficulty]);

  const updateGameState = useCallback(() => {
    const isGameOver = chess.isGameOver();
    const isCheckmate = chess.isCheckmate();
    const isStalemate = chess.isStalemate();
    const isDraw = chess.isDraw();
    
    let gameStatus: GameState['gameStatus'] = 'playing';
    let winner: GameState['winner'] = null;
    
    if (isGameOver) {
      if (isCheckmate) {
        gameStatus = 'checkmate';
        winner = chess.turn() === 'w' ? 'black' : 'white';
      } else if (isStalemate) {
        gameStatus = 'stalemate';
      } else if (isDraw) {
        gameStatus = 'draw';
      }
    }

    const newState: GameState = {
      fen: chess.fen(),
      pgn: chess.pgn(),
      moveHistory: chess.history(),
      currentPlayer: chess.turn() === 'w' ? 'white' : 'black',
      gameStatus,
      winner,
    };

    setGameState(newState);
    setGameHistory(chess.history());
    setHistoryIndex(chess.history().length - 1);
  }, [chess, setGameState]);

  const makeMove = useCallback(async (move: ChessMove | string) => {
    try {
      // Handle both object and string move formats
      const moveResult = typeof move === 'string' ? chess.move(move) : chess.move(move);
      
      if (!moveResult) {
        console.log('Invalid move attempted:', move);
        return false;
      }

      // Play sound effect
      if (settings.soundEnabled) {
        if (moveResult.captured) {
          playCaptureSound();
        } else {
          playMoveSound();
        }
      }

      updateGameState();

      // If playing against AI and it's AI's turn and game is not over
      if (settings.gameMode === 'ai' && chess.turn() === 'b' && !chess.isGameOver()) {
        const aiMove = await calculateAIMove();
        if (aiMove) {
          const aiMoveResult = chess.move(aiMove);
          if (aiMoveResult) {
            if (settings.soundEnabled) {
              if (aiMoveResult.captured) {
                playCaptureSound();
              } else {
                playMoveSound();
              }
            }
            updateGameState();
          }
        }
      }

      return true;
    } catch (error) {
      console.error('Error making move:', error);
      return false;
    }
  }, [chess, settings, updateGameState, calculateAIMove]);

  const undoMove = useCallback(() => {
    if (chess.history().length === 0) return;
    
    try {
      // In AI mode, undo both player and AI moves
      if (settings.gameMode === 'ai' && chess.history().length >= 2) {
        chess.undo(); // Undo AI move
        chess.undo(); // Undo player move
      } else {
        chess.undo(); // Undo last move
      }
      
      updateGameState();
    } catch (error) {
      console.error('Error undoing move:', error);
    }
  }, [chess, settings.gameMode, updateGameState]);

  const redoMove = useCallback(() => {
    // For simplicity, redo is not implemented in this version
    // Could be added by maintaining a separate move stack
    console.log('Redo functionality not implemented');
  }, []);

  const resetGame = useCallback(() => {
    chess.reset();
    setGameHistory([]);
    setHistoryIndex(-1);
    setIsAiThinking(false);
    updateGameState();
  }, [chess, updateGameState]);

  const canUndo = chess.history().length > 0 && !isAiThinking;
  const canRedo = false; // Simplified for this implementation

  return {
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
  };
}