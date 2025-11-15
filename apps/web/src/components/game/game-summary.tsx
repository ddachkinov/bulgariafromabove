'use client';

import { formatDistance, formatScore } from '@bulgaria/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GameSummaryProps {
  result: {
    gameId: string;
    mode: string;
    totalScore: number;
    avgDistance: number;
    rounds: Array<{
      roundNumber: number;
      distance: number;
      points: number;
      timeSpent: number;
    }>;
  };
  onPlayAgain: () => void;
}

export function GameSummary({ result, onPlayAgain }: GameSummaryProps) {
  const totalTime = result.rounds.reduce(
    (sum, round) => sum + (round.timeSpent || 0),
    0
  );

  const bestRound = result.rounds.reduce((best, round) =>
    round.points > best.points ? round : best
  );

  const worstRound = result.rounds.reduce((worst, round) =>
    round.points < worst.points ? round : worst
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Game Complete!
          </h1>
          <p className="text-xl text-gray-600">
            {result.mode === 'classic' ? 'Classic Mode' : '5-Round Challenge'}
          </p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Total Score</div>
                <div className="text-4xl font-bold text-primary">
                  {formatScore(result.totalScore)}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Avg. Distance</div>
                <div className="text-4xl font-bold text-gray-900">
                  {formatDistance(result.avgDistance)}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Total Time</div>
                <div className="text-4xl font-bold text-gray-900">
                  {totalTime.toFixed(0)}s
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Round Breakdown */}
        {result.rounds.length > 1 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Round by Round</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.rounds.map((round) => (
                  <div
                    key={round.roundNumber}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">
                        {round.roundNumber}
                      </div>
                      <div>
                        <div className="font-semibold">
                          {formatScore(round.points)} points
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatDistance(round.distance)} •{' '}
                          {round.timeSpent?.toFixed(1)}s
                        </div>
                      </div>
                    </div>
                    {round.roundNumber === bestRound.roundNumber && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Best
                      </span>
                    )}
                    {round.roundNumber === worstRound.roundNumber &&
                      result.rounds.length > 1 && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          Worst
                        </span>
                      )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={onPlayAgain} className="px-8">
            Play Again
          </Button>
          <Button size="lg" variant="outline" asChild className="px-8">
            <a href="/leaderboard">View Leaderboard</a>
          </Button>
          <Button size="lg" variant="outline" asChild className="px-8">
            <a href="/profile">My Profile</a>
          </Button>
        </div>

        {/* Share Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Share Your Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  const text = `I scored ${formatScore(result.totalScore)} points in Bulgaria From Above! Can you beat my score?`;
                  const url = window.location.origin;
                  window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
                    '_blank'
                  );
                }}
              >
                Share on X
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const text = `I scored ${formatScore(result.totalScore)} points in Bulgaria From Above!`;
                  const url = window.location.origin;
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
                    '_blank'
                  );
                }}
              >
                Share on Facebook
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `I scored ${formatScore(result.totalScore)} points in Bulgaria From Above! ${window.location.origin}`
                  );
                  alert('Link copied to clipboard!');
                }}
              >
                Copy Link
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Banner Ad Placeholder */}
        <div className="mt-8">
          <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-500">Banner Ad Placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
}
