'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { formatScore, formatDistance } from '@bulgaria/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Period = 'daily' | 'weekly' | 'alltime';

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>('alltime');

  const { data, isLoading, error } = useQuery({
    queryKey: ['leaderboard', period],
    queryFn: async () => {
      const response: any = await api.getLeaderboard(period);
      return response.data;
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8">Leaderboard</h1>

        {/* Period Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          <Button
            variant={period === 'daily' ? 'default' : 'outline'}
            onClick={() => setPeriod('daily')}
          >
            Daily
          </Button>
          <Button
            variant={period === 'weekly' ? 'default' : 'outline'}
            onClick={() => setPeriod('weekly')}
          >
            Weekly
          </Button>
          <Button
            variant={period === 'alltime' ? 'default' : 'outline'}
            onClick={() => setPeriod('alltime')}
          >
            All Time
          </Button>
        </div>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle>
              {period === 'daily' && 'Today\'s Top Players'}
              {period === 'weekly' && 'This Week\'s Top Players'}
              {period === 'alltime' && 'All-Time Top Players'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Loading leaderboard...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-12 text-red-600">
                Failed to load leaderboard
              </div>
            )}

            {data && data.leaderboard && data.leaderboard.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No scores yet. Be the first to play!
              </div>
            )}

            {data && data.leaderboard && data.leaderboard.length > 0 && (
              <div className="space-y-2">
                {data.leaderboard.map((entry: any, index: number) => (
                  <div
                    key={entry.userId}
                    className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                      index < 3
                        ? 'bg-gradient-to-r from-yellow-50 to-yellow-100'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    {/* Rank */}
                    <div className="flex-shrink-0 w-12 text-center">
                      {index === 0 && (
                        <span className="text-3xl">🥇</span>
                      )}
                      {index === 1 && (
                        <span className="text-3xl">🥈</span>
                      )}
                      {index === 2 && (
                        <span className="text-3xl">🥉</span>
                      )}
                      {index > 2 && (
                        <span className="text-xl font-bold text-gray-600">
                          {entry.rank}
                        </span>
                      )}
                    </div>

                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center text-white font-bold">
                        {entry.avatarId ? entry.avatarId.split('-')[1] : '?'}
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-lg truncate">
                        {entry.username}
                      </div>
                      <div className="text-sm text-gray-600">
                        {entry.gamesPlayed} game{entry.gamesPlayed !== 1 ? 's' : ''} •{' '}
                        Avg: {formatDistance(entry.avgDistance || 0)}
                      </div>
                    </div>

                    {/* Score */}
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {formatScore(entry.totalScore)}
                      </div>
                      <div className="text-xs text-gray-500">points</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
