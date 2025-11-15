'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { formatScore, formatDistance } from '@bulgaria/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AVATARS } from '@bulgaria/config';

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch profile
  const { data: profile, isLoading: profileLoading, refetch: refetchProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      try {
        const response: any = await api.getProfile();
        if (response.success) {
          setUsername(response.data.username);
          setSelectedAvatar(response.data.avatarId || AVATARS[0]);
          return response.data;
        }
      } catch (error) {
        // If not authenticated, redirect to login
        if ((error as Error).message.includes('token')) {
          router.push('/auth/login?redirect=/profile');
        }
        throw error;
      }
    },
  });

  // Fetch stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const response: any = await api.getStats();
      return response.data;
    },
  });

  const handleUpdateProfile = async () => {
    setUpdateError('');
    setIsUpdating(true);

    try {
      const response: any = await api.updateProfile({
        username,
        avatarId: selectedAvatar,
      });

      if (response.success) {
        setIsEditing(false);
        refetchProfile();
      } else {
        setUpdateError(response.error || 'Update failed');
      }
    } catch (error) {
      setUpdateError((error as Error).message || 'An error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    router.push('/');
  };

  if (profileLoading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">My Profile</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {/* Profile Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            {updateError && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
                {updateError}
              </div>
            )}

            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {isEditing ? (
                  <div>
                    <div className="mb-2 text-sm font-medium">Select Avatar</div>
                    <div className="grid grid-cols-4 gap-2">
                      {AVATARS.map((avatar) => (
                        <button
                          key={avatar}
                          type="button"
                          onClick={() => setSelectedAvatar(avatar)}
                          className={`p-1 border-2 rounded-lg hover:border-primary transition-colors ${
                            selectedAvatar === avatar
                              ? 'border-primary bg-primary/10'
                              : 'border-gray-200'
                          }`}
                        >
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center text-white font-bold">
                            {avatar.split('-')[1]}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                    {profile?.avatarId ? profile.avatarId.split('-')[1] : '?'}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Username
                    </label>
                    {isEditing ? (
                      <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        minLength={3}
                        maxLength={20}
                        pattern="[a-zA-Z0-9_]+"
                      />
                    ) : (
                      <div className="text-2xl font-bold">{profile?.username}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <div className="text-gray-600">{profile?.email}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Member Since
                    </label>
                    <div className="text-gray-600">
                      {profile?.createdAt
                        ? new Date(profile.createdAt).toLocaleDateString()
                        : '-'}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  {isEditing ? (
                    <>
                      <Button onClick={handleUpdateProfile} disabled={isUpdating}>
                        {isUpdating ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setUsername(profile?.username || '');
                          setSelectedAvatar(profile?.avatarId || AVATARS[0]);
                          setUpdateError('');
                        }}
                        disabled={isUpdating}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">
                  {stats?.totalGames || 0}
                </div>
                <div className="text-sm text-gray-600 mt-1">Games Played</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">
                  {formatScore(stats?.bestScore || 0)}
                </div>
                <div className="text-sm text-gray-600 mt-1">Best Score</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">
                  {formatDistance(stats?.averageDistance || 0)}
                </div>
                <div className="text-sm text-gray-600 mt-1">Avg. Distance</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">
                  {formatScore(stats?.totalPoints || 0)}
                </div>
                <div className="text-sm text-gray-600 mt-1">Total Points</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button asChild variant="outline" className="h-auto py-4">
                <a href="/game/classic">
                  <div className="text-left">
                    <div className="font-semibold">Play Classic Mode</div>
                    <div className="text-sm text-gray-600">
                      Single photo challenge
                    </div>
                  </div>
                </a>
              </Button>

              <Button asChild variant="outline" className="h-auto py-4">
                <a href="/game/5-round">
                  <div className="text-left">
                    <div className="font-semibold">Play 5-Round Challenge</div>
                    <div className="text-sm text-gray-600">
                      Five photos, total score
                    </div>
                  </div>
                </a>
              </Button>

              <Button asChild variant="outline" className="h-auto py-4">
                <a href="/leaderboard">
                  <div className="text-left">
                    <div className="font-semibold">View Leaderboard</div>
                    <div className="text-sm text-gray-600">
                      See top players
                    </div>
                  </div>
                </a>
              </Button>

              <Button asChild variant="outline" className="h-auto py-4">
                <a href="/">
                  <div className="text-left">
                    <div className="font-semibold">Home</div>
                    <div className="text-sm text-gray-600">
                      Back to main menu
                    </div>
                  </div>
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
