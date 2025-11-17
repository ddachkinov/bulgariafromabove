'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { formatDistance, formatScore } from '@bulgaria/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface RoundResultProps {
  result: {
    roundNumber: number;
    result: {
      actualLat: number;
      actualLng: number;
      guessLat: number;
      guessLng: number;
      distance: number;
      points: number;
      timeSpent: number;
    };
    gameScore: number;
    hasNextRound: boolean;
  };
  onContinue: () => void;
}

// Component to auto-fit map bounds using react-leaflet's useMap hook
function AutoFitBounds({
  actualLat,
  actualLng,
  guessLat,
  guessLng,
}: {
  actualLat: number;
  actualLng: number;
  guessLat: number;
  guessLng: number;
}) {
  const map = useMap();

  useEffect(() => {
    const bounds = L.latLngBounds(
      [actualLat, actualLng],
      [guessLat, guessLng]
    );
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [map, actualLat, actualLng, guessLat, guessLng]);

  return null;
}

// Custom icons for actual vs guess
const actualIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const guessIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export function RoundResult({ result, onContinue }: RoundResultProps) {
  const { actualLat, actualLng, guessLat, guessLng, distance, points, timeSpent } =
    result.result;

  const getAccuracyMessage = (distance: number) => {
    if (distance < 100) return { text: 'Perfect!', color: 'text-green-600' };
    if (distance < 1000) return { text: 'Excellent!', color: 'text-green-500' };
    if (distance < 5000) return { text: 'Great!', color: 'text-blue-600' };
    if (distance < 20000) return { text: 'Good!', color: 'text-yellow-600' };
    if (distance < 50000) return { text: 'Not bad!', color: 'text-orange-600' };
    return { text: 'Keep trying!', color: 'text-red-600' };
  };

  const accuracy = getAccuracyMessage(distance);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={[actualLat, actualLng]}
          zoom={7}
          className="w-full h-[50vh] lg:h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <AutoFitBounds
            actualLat={actualLat}
            actualLng={actualLng}
            guessLat={guessLat}
            guessLng={guessLng}
          />

          {/* Actual location marker (green) */}
          <Marker position={[actualLat, actualLng]} icon={actualIcon}>
            <Popup>Actual Location</Popup>
          </Marker>

          {/* Guess marker (red) */}
          <Marker position={[guessLat, guessLng]} icon={guessIcon}>
            <Popup>Your Guess</Popup>
          </Marker>

          {/* Line connecting the two */}
          <Polyline
            positions={[
              [actualLat, actualLng],
              [guessLat, guessLng],
            ]}
            color="blue"
            weight={3}
            opacity={0.6}
            dashArray="10, 10"
          />
        </MapContainer>
      </div>

      {/* Results Panel */}
      <div className="w-full lg:w-96 bg-white p-6 shadow-lg flex flex-col">
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-6">Round {result.roundNumber}</h2>

          {/* Accuracy Message */}
          <div className={`text-4xl font-bold mb-6 ${accuracy.color}`}>
            {accuracy.text}
          </div>

          {/* Stats Cards */}
          <div className="space-y-4 mb-8">
            <Card className="p-4">
              <div className="text-sm text-gray-600">Distance</div>
              <div className="text-2xl font-bold text-gray-900">
                {formatDistance(distance)}
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-sm text-gray-600">Points Earned</div>
              <div className="text-2xl font-bold text-primary">
                {formatScore(points)}
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-sm text-gray-600">Time Taken</div>
              <div className="text-2xl font-bold text-gray-900">
                {timeSpent.toFixed(1)}s
              </div>
            </Card>

            <Card className="p-4 bg-primary/10">
              <div className="text-sm text-gray-600">Total Score</div>
              <div className="text-3xl font-bold text-primary">
                {formatScore(result.gameScore)}
              </div>
            </Card>
          </div>
        </div>

        {/* Legend */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm font-semibold mb-2">Map Legend:</div>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span>Actual location</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span>Your guess</span>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <Button size="lg" onClick={onContinue} className="w-full">
          {result.hasNextRound ? 'Next Round' : 'View Results'}
        </Button>
      </div>
    </div>
  );
}
