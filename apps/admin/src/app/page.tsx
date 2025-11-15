import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Bulgaria From Above - Admin</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
          <p className="text-gray-600">Manage photos and content</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Upload Photos */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Upload Photos</CardTitle>
              <CardDescription>
                Add new photos to the game
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/upload">Upload New Photos</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Manage Photos */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Manage Photos</CardTitle>
              <CardDescription>
                View, edit, and approve photos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="outline">
                <Link href="/photos">Manage Photos</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
              <CardDescription>
                View usage and analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="outline">
                <Link href="/stats">View Stats</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Total Photos</div>
                <div className="text-3xl font-bold text-primary">-</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Pending Approval</div>
                <div className="text-3xl font-bold text-yellow-600">-</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Total Users</div>
                <div className="text-3xl font-bold text-primary">-</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Games Played</div>
                <div className="text-3xl font-bold text-primary">-</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
