import { create } from 'zustand';

interface GameState {
  gameId: string | null;
  mode: 'classic' | '5-round' | null;
  roundNumber: number;
  currentPhoto: {
    id: string;
    url: string;
  } | null;
  timeLimit: number;
  totalScore: number;
  setGame: (game: {
    gameId: string;
    mode: 'classic' | '5-round';
    roundNumber: number;
    photo: { id: string; url: string };
    timeLimit: number;
  }) => void;
  updateRound: (data: {
    roundNumber: number;
    photo: { id: string; url: string } | null;
    score: number;
  }) => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  gameId: null,
  mode: null,
  roundNumber: 1,
  currentPhoto: null,
  timeLimit: 30,
  totalScore: 0,
  setGame: (game) =>
    set({
      gameId: game.gameId,
      mode: game.mode,
      roundNumber: game.roundNumber,
      currentPhoto: game.photo,
      timeLimit: game.timeLimit,
      totalScore: 0,
    }),
  updateRound: (data) =>
    set((state) => ({
      roundNumber: data.roundNumber + 1,
      currentPhoto: data.photo,
      totalScore: state.totalScore + data.score,
    })),
  reset: () =>
    set({
      gameId: null,
      mode: null,
      roundNumber: 1,
      currentPhoto: null,
      timeLimit: 30,
      totalScore: 0,
    }),
}));
