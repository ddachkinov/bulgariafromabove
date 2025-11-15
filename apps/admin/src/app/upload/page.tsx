'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { adminApi } from '@/lib/api';
import { uploadToSpaces, createThumbnail } from '@/lib/upload';
import { extractExifData } from '@/lib/exif';
import { BULGARIA_BOUNDS, PHOTO_CATEGORIES } from '@bulgaria/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Fix Leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function LocationPicker({
  position,
  onPositionChange,
}: {
  position: [number, number] | null;
  onPositionChange: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click: (e) => {
      onPositionChange(e.latlng.lat, e.latlng.lng);
    },
  });

  return position ? <Marker position={position} /> : null;
}

export default function UploadPage() {
  const router = useRouter();

  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [error, setError] = useState('');

  // Photo metadata
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState(1);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    setError('');

    // Try to extract EXIF data from first file
    if (acceptedFiles.length > 0) {
      setUploadProgress('Extracting metadata...');
      const metadata = await extractExifData(acceptedFiles[0]);

      if (metadata.latitude && metadata.longitude) {
        setLatitude(metadata.latitude);
        setLongitude(metadata.longitude);
        setUploadProgress('GPS coordinates found in EXIF data');
      } else {
        setUploadProgress('No GPS data found. Please select location on map.');
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    multiple: true,
  });

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select at least one file');
      return;
    }

    if (latitude === null || longitude === null) {
      setError('Please select a location on the map');
      return;
    }

    setUploading(true);
    setError('');

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(`Uploading ${i + 1}/${files.length}: ${file.name}...`);

        // Create thumbnail
        setUploadProgress(`Creating thumbnail for ${file.name}...`);
        const thumbnail = await createThumbnail(file);

        // Upload original and thumbnail to Spaces
        setUploadProgress(`Uploading ${file.name} to storage...`);
        const [url, thumbnailUrl] = await Promise.all([
          uploadToSpaces(file, 'photos'),
          uploadToSpaces(thumbnail, 'thumbnails'),
        ]);

        // Save to database via API
        setUploadProgress(`Saving ${file.name} to database...`);
        await adminApi.uploadPhoto({
          url,
          thumbnailUrl,
          latitude: latitude!,
          longitude: longitude!,
          city: city || undefined,
          region: region || undefined,
          category: category || undefined,
          difficulty,
        });
      }

      setUploadProgress(`Successfully uploaded ${files.length} photo(s)!`);

      // Reset form
      setTimeout(() => {
        setFiles([]);
        setLatitude(null);
        setLongitude(null);
        setCity('');
        setRegion('');
        setCategory('');
        setDifficulty(1);
        setUploadProgress('');
        router.push('/photos');
      }, 2000);
    } catch (err) {
      setError((err as Error).message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Upload Photos</h1>
          <Button variant="outline" onClick={() => router.push('/')}>
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - File Upload & Metadata */}
          <div className="space-y-6">
            {/* File Drop Zone */}
            <Card>
              <CardHeader>
                <CardTitle>Select Photos</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-300 hover:border-primary'
                  }`}
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p className="text-primary">Drop files here...</p>
                  ) : (
                    <div>
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="mt-2 text-sm text-gray-600">
                        Drag & drop photos here, or click to select
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        JPG, PNG, WEBP up to 10MB each
                      </p>
                    </div>
                  )}
                </div>

                {files.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">
                      Selected files ({files.length}):
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {files.map((file, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="text-green-600">✓</span>
                          {file.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Metadata Form */}
            <Card>
              <CardHeader>
                <CardTitle>Photo Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Latitude *
                    </label>
                    <Input
                      type="number"
                      step="0.000001"
                      value={latitude || ''}
                      onChange={(e) => setLatitude(parseFloat(e.target.value))}
                      placeholder="42.6977"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Longitude *
                    </label>
                    <Input
                      type="number"
                      step="0.000001"
                      value={longitude || ''}
                      onChange={(e) => setLongitude(parseFloat(e.target.value))}
                      placeholder="23.3219"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <Input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Sofia"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Region</label>
                  <Input
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="Sofia City"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category
                  </label>
                  <select
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Select category</option>
                    {PHOTO_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Difficulty (1-5)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    value={difficulty}
                    onChange={(e) => setDifficulty(parseInt(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Upload Button */}
            <Card>
              <CardContent className="pt-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}

                {uploadProgress && (
                  <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded mb-4">
                    {uploadProgress}
                  </div>
                )}

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleUpload}
                  disabled={uploading || files.length === 0}
                >
                  {uploading ? 'Uploading...' : `Upload ${files.length} Photo(s)`}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Map */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Select Location on Map</CardTitle>
                <p className="text-sm text-gray-600">
                  Click on the map to set the photo location
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-[600px] rounded-lg overflow-hidden border">
                  <MapContainer
                    center={[BULGARIA_BOUNDS.center.lat, BULGARIA_BOUNDS.center.lng]}
                    zoom={7}
                    className="w-full h-full"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationPicker
                      position={
                        latitude && longitude ? [latitude, longitude] : null
                      }
                      onPositionChange={handleLocationSelect}
                    />
                  </MapContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
