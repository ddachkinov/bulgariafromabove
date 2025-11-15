'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { BULGARIA_BOUNDS } from '@bulgaria/utils';
import { Button } from '@/components/ui/button';

// Fix Leaflet icon issue with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapGuessProps {
  onSubmit: (lat: number, lng: number) => void;
}

function MapClickHandler({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function MapGuess({ onSubmit }: MapGuessProps) {
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    null
  );
  const [startTime] = useState(Date.now());
  const mapRef = useRef<L.Map>(null);

  const handleLocationSelect = (lat: number, lng: number) => {
    setMarkerPosition([lat, lng]);
  };

  const handleSubmit = () => {
    if (markerPosition) {
      onSubmit(markerPosition[0], markerPosition[1]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-center">
            Where was this photo taken?
          </h2>
          <p className="text-center text-gray-600 mt-2">
            Click on the map to place your guess
          </p>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={[BULGARIA_BOUNDS.center.lat, BULGARIA_BOUNDS.center.lng]}
          zoom={7}
          className="w-full h-full"
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onLocationSelect={handleLocationSelect} />
          {markerPosition && <Marker position={markerPosition} />}
        </MapContainer>

        {/* Submit Button */}
        {markerPosition && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[1000]">
            <Button
              size="lg"
              onClick={handleSubmit}
              className="shadow-lg text-lg px-8 py-6"
            >
              Confirm Guess
            </Button>
          </div>
        )}

        {/* Instruction overlay */}
        {!markerPosition && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white px-8 py-4 rounded-lg pointer-events-none z-[1000]">
            <p className="text-xl text-center">
              Click anywhere on the map to place your marker
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
