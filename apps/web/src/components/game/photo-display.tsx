'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface PhotoDisplayProps {
  photoUrl: string;
  timeLimit: number;
  onTimeout: () => void;
}

export function PhotoDisplay({
  photoUrl,
  timeLimit,
  onTimeout,
}: PhotoDisplayProps) {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setFadeOut(true);
          timeoutId = setTimeout(() => {
            onTimeout();
          }, 500); // Wait for fade animation
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timer) clearInterval(timer);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [onTimeout]);

  const progress = (timeRemaining / timeLimit) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4">
      {/* Timer */}
      <div className="w-full max-w-4xl mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white text-lg font-semibold">
            Look carefully...
          </span>
          <span className="text-white text-2xl font-bold">
            {timeRemaining}s
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Photo */}
      <div
        className={`relative w-full max-w-4xl aspect-video bg-gray-900 rounded-lg overflow-hidden transition-opacity duration-500 ${
          fadeOut ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <img
          src={photoUrl}
          alt="Location to guess"
          className="w-full h-full object-contain"
          priority
        />
      </div>

      {/* Instruction */}
      <p className="text-white text-center mt-6 text-lg">
        Memorize this location. You&apos;ll need to guess where it was taken!
      </p>
    </div>
  );
}
