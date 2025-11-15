'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PHOTO_CATEGORIES } from '@bulgaria/config';

export default function PhotosPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [filterApproved, setFilterApproved] = useState<boolean | undefined>(undefined);
  const [filterCategory, setFilterCategory] = useState('');
  const [editingPhoto, setEditingPhoto] = useState<any>(null);

  // Fetch photos
  const { data, isLoading } = useQuery({
    queryKey: ['admin-photos', page, filterApproved, filterCategory],
    queryFn: async () => {
      const response: any = await adminApi.getPhotos({
        page,
        limit: 20,
        approved: filterApproved,
        category: filterCategory || undefined,
      });
      return response.data;
    },
  });

  // Update photo mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return adminApi.updatePhoto(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-photos'] });
      setEditingPhoto(null);
    },
  });

  // Delete photo mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return adminApi.deletePhoto(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-photos'] });
    },
  });

  const handleApprove = (photo: any) => {
    updateMutation.mutate({
      id: photo.id,
      data: { approved: true },
    });
  };

  const handleReject = (photo: any) => {
    if (confirm('Are you sure you want to delete this photo?')) {
      deleteMutation.mutate(photo.id);
    }
  };

  const handleEdit = (photo: any) => {
    setEditingPhoto(photo);
  };

  const handleSaveEdit = () => {
    if (editingPhoto) {
      updateMutation.mutate({
        id: editingPhoto.id,
        data: {
          latitude: editingPhoto.latitude,
          longitude: editingPhoto.longitude,
          city: editingPhoto.city,
          region: editingPhoto.region,
          category: editingPhoto.category,
          difficulty: editingPhoto.difficulty,
          approved: editingPhoto.approved,
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Manage Photos</h1>
          <div className="flex gap-2">
            <Button onClick={() => router.push('/upload')}>Upload New</Button>
            <Button variant="outline" onClick={() => router.push('/')}>
              Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  className="h-10 rounded-md border border-input bg-background px-3 py-2"
                  value={
                    filterApproved === undefined ? '' : filterApproved.toString()
                  }
                  onChange={(e) =>
                    setFilterApproved(
                      e.target.value === '' ? undefined : e.target.value === 'true'
                    )
                  }
                >
                  <option value="">All</option>
                  <option value="true">Approved</option>
                  <option value="false">Pending</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  className="h-10 rounded-md border border-input bg-background px-3 py-2"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="">All</option>
                  {PHOTO_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilterApproved(undefined);
                    setFilterCategory('');
                    setPage(1);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Photos Grid */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading photos...</p>
          </div>
        )}

        {data && data.photos && data.photos.length === 0 && (
          <Card>
            <CardContent className="text-center py-12 text-gray-500">
              No photos found
            </CardContent>
          </Card>
        )}

        {data && data.photos && data.photos.length > 0 && (
          <div className="space-y-4">
            {data.photos.map((photo: any) => (
              <Card key={photo.id}>
                <CardContent className="pt-6">
                  <div className="flex gap-6">
                    {/* Photo Thumbnail */}
                    <div className="flex-shrink-0">
                      <img
                        src={photo.thumbnailUrl}
                        alt={photo.city || 'Photo'}
                        className="w-48 h-32 object-cover rounded-lg"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      {editingPhoto?.id === photo.id ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs font-medium">Latitude</label>
                              <Input
                                type="number"
                                step="0.000001"
                                value={editingPhoto.latitude}
                                onChange={(e) =>
                                  setEditingPhoto({
                                    ...editingPhoto,
                                    latitude: parseFloat(e.target.value),
                                  })
                                }
                                className="h-8"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium">Longitude</label>
                              <Input
                                type="number"
                                step="0.000001"
                                value={editingPhoto.longitude}
                                onChange={(e) =>
                                  setEditingPhoto({
                                    ...editingPhoto,
                                    longitude: parseFloat(e.target.value),
                                  })
                                }
                                className="h-8"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs font-medium">City</label>
                              <Input
                                value={editingPhoto.city || ''}
                                onChange={(e) =>
                                  setEditingPhoto({
                                    ...editingPhoto,
                                    city: e.target.value,
                                  })
                                }
                                className="h-8"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium">Region</label>
                              <Input
                                value={editingPhoto.region || ''}
                                onChange={(e) =>
                                  setEditingPhoto({
                                    ...editingPhoto,
                                    region: e.target.value,
                                  })
                                }
                                className="h-8"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs font-medium">Category</label>
                              <select
                                className="w-full h-8 rounded-md border border-input bg-background px-2 text-sm"
                                value={editingPhoto.category || ''}
                                onChange={(e) =>
                                  setEditingPhoto({
                                    ...editingPhoto,
                                    category: e.target.value,
                                  })
                                }
                              >
                                <option value="">None</option>
                                {PHOTO_CATEGORIES.map((cat) => (
                                  <option key={cat} value={cat}>
                                    {cat}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="text-xs font-medium">Difficulty</label>
                              <Input
                                type="number"
                                min="1"
                                max="5"
                                value={editingPhoto.difficulty}
                                onChange={(e) =>
                                  setEditingPhoto({
                                    ...editingPhoto,
                                    difficulty: parseInt(e.target.value),
                                  })
                                }
                                className="h-8"
                              />
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button size="sm" onClick={handleSaveEdit}>
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingPhoto(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {photo.city || 'Unnamed'}
                                {photo.region && `, ${photo.region}`}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {photo.latitude.toFixed(6)}, {photo.longitude.toFixed(6)}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {photo.approved ? (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                  Approved
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                                  Pending
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-sm text-gray-600 space-y-1 mb-4">
                            {photo.category && (
                              <div>
                                <span className="font-medium">Category:</span>{' '}
                                {photo.category}
                              </div>
                            )}
                            <div>
                              <span className="font-medium">Difficulty:</span>{' '}
                              {photo.difficulty}/5
                            </div>
                            <div>
                              <span className="font-medium">Uploaded:</span>{' '}
                              {new Date(photo.createdAt).toLocaleDateString()}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            {!photo.approved && (
                              <Button
                                size="sm"
                                onClick={() => handleApprove(photo)}
                                disabled={updateMutation.isPending}
                              >
                                Approve
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(photo)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(photo)}
                              disabled={deleteMutation.isPending}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {data && data.pagination && (
          <div className="mt-6 flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-4">
              Page {page} of {Math.ceil(data.pagination.total / 20)}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage((p) => p + 1)}
              disabled={!data.pagination.hasMore}
            >
              Next
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
