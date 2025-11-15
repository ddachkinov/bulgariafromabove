/**
 * Calculate distance between two geographic coordinates using the Haversine formula
 * @param lat1 - Latitude of first point
 * @param lon1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lon2 - Longitude of second point
 * @returns Distance in meters
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

/**
 * Validate if coordinates are within valid ranges
 * @param lat - Latitude
 * @param lon - Longitude
 * @returns true if valid, false otherwise
 */
export function isValidCoordinates(lat: number, lon: number): boolean {
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
}

/**
 * Bulgaria bounding box for map initialization
 */
export const BULGARIA_BOUNDS = {
  north: 44.2,
  south: 41.2,
  east: 28.6,
  west: 22.4,
  center: {
    lat: 42.7,
    lng: 25.5,
  },
};

/**
 * Check if coordinates are within Bulgaria's bounding box
 * @param lat - Latitude
 * @param lon - Longitude
 * @returns true if within Bulgaria, false otherwise
 */
export function isInBulgaria(lat: number, lon: number): boolean {
  return (
    lat >= BULGARIA_BOUNDS.south &&
    lat <= BULGARIA_BOUNDS.north &&
    lon >= BULGARIA_BOUNDS.west &&
    lon <= BULGARIA_BOUNDS.east
  );
}
