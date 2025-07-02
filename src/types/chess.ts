export interface GameState {
  fen: string;
  pgn: string;
  moveHistory: string[];
  currentPlayer: 'white' | 'black';
  gameStatus: 'playing' | 'checkmate' | 'stalemate' | 'draw';
  winner?: 'white' | 'black' | null;
  lastMove?: {
    from: string;
    to: string;
    san: string;
  };
}

export interface GameSettings {
  theme: 'light' | 'dark';
  gameMode: 'local' | 'ai';
  aiDifficulty: 1 | 2 | 3 | 4 | 5;
  soundEnabled: boolean;
}

export interface ChessMove {
  from: string;
  to: string;
  promotion?: string;
}

export interface MoveResult {
  color: 'w' | 'b';
  from: string;
  to: string;
  flags: string;
  piece: string;
  san: string;
  captured?: string;
  promotion?: string;
}