import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Bulgaria From Above
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Test your knowledge of Bulgaria! View photos and guess where they
            were taken.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <Card className="p-8 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold mb-4">Classic Mode</h2>
            <p className="text-gray-600 mb-6">
              Single photo, 30 seconds to view and guess. Perfect for a quick
              challenge!
            </p>
            <Button asChild className="w-full">
              <Link href="/game/classic">Play Classic</Link>
            </Button>
          </Card>

          <Card className="p-8 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold mb-4">5-Round Challenge</h2>
            <p className="text-gray-600 mb-6">
              Five photos, 20 seconds each. Compete for the highest total
              score!
            </p>
            <Button asChild className="w-full">
              <Link href="/game/5-round">Play Challenge</Link>
            </Button>
          </Card>
        </div>

        <div className="flex justify-center gap-4">
          <Button asChild variant="outline">
            <Link href="/leaderboard">Leaderboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/profile">Profile</Link>
          </Button>
        </div>

        {/* Banner Ad Placeholder */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-500">Banner Ad Placeholder</p>
          </div>
        </div>
      </div>
    </main>
  );
}
