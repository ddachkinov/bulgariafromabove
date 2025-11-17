'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/game-store';
import { api } from '@/lib/api';
import { PhotoDisplay } from '@/components/game/photo-display';
import { MapGuess } from '@/components/game/map-guess';
import { RoundResult } from '@/components/game/round-result';
import { GameSummary } from '@/components/game/game-summary';

type GamePhase = 'loading' | 'photo' | 'guessing' | 'result' | 'summary';

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const mode = params.mode as 'classic' | '5-round';

  const [phase, setPhase] = useState<GamePhase>('loading');
  const [photoStartTime, setPhotoStartTime] = useState<number>(0);
  const [roundResult, setRoundResult] = useState<any>(null);
  const [gameResult, setGameResult] = useState<any>(null);

  const { gameId, currentPhoto, timeLimit, setGame, updateRound, reset } = useGameStore();

  // Initialize game
  useEffect(() => {
    const initGame = async () => {
      try {
        const response: any = await api.startGame(mode);

        if (response.success) {
          setGame({
            gameId: response.data.gameId,
            mode: response.data.mode,
            roundNumber: response.data.roundNumber,
            photo: response.data.photo,
            timeLimit: response.data.timeLimit,
          });
          setPhotoStartTime(Date.now());
          setPhase('photo');
        }
      } catch (error) {
        console.error('Failed to start game:', error);
        // If not authenticated, redirect to login
        if ((error as Error).message.includes('token')) {
          router.push('/auth/login?redirect=/game/' + mode);
        }
      }
    };

    reset();
    initGame();
  }, [mode, setGame, reset, router]);

  const handlePhotoTimeout = () => {
    setPhase('guessing');
  };

  const handleGuessSubmit = async (lat: number, lng: number) => {
    if (!gameId) return;

    const timeSpent = (Date.now() - photoStartTime) / 1000;

    try {
      const response: any = await api.submitGuess(gameId, lat, lng, timeSpent);

      if (response.success) {
        setRoundResult(response.data);
        setPhase('result');
      }
    } catch (error) {
      console.error('Failed to submit guess:', error);
    }
  };

  const handleContinue = () => {
    if (roundResult?.hasNextRound && roundResult?.nextPhoto) {
      // Update store with next round data
      updateRound({
        roundNumber: roundResult.roundNumber,
        photo: roundResult.nextPhoto,
        score: roundResult.result.points,
      });
      // Move to next round
      setRoundResult(null);
      setPhotoStartTime(Date.now());
      setPhase('photo');
    } else {
      // Complete game and show summary
      completeGame();
    }
  };

  const completeGame = async () => {
    if (!gameId) return;

    try {
      const response: any = await api.completeGame(gameId);

      if (response.success) {
        setGameResult(response.data);
        setPhase('summary');
      }
    } catch (error) {
      console.error('Failed to complete game:', error);
    }
  };

  const handlePlayAgain = () => {
    router.push('/');
  };

  if (phase === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Starting game...</p>
        </div>
      </div>
    );
  }

  if (phase === 'summary' && gameResult) {
    return <GameSummary result={gameResult} onPlayAgain={handlePlayAgain} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {phase === 'photo' && currentPhoto && (
        <PhotoDisplay
          photoUrl={currentPhoto.url}
          timeLimit={timeLimit}
          onTimeout={handlePhotoTimeout}
        />
      )}

      {phase === 'guessing' && (
        <MapGuess onSubmit={handleGuessSubmit} />
      )}

      {phase === 'result' && roundResult && (
        <RoundResult result={roundResult} onContinue={handleContinue} />
      )}
    </div>
  );
}
