export interface NearestMosque {
  id: string;
  name: string;
  lat: number;
  lng: number;
  distance: number;
  lastFetched: number;
}

const CACHE_KEY = 'nearest-mosque-cache';
const CACHE_DURATION = 60 * 60 * 1000;

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function getCachedMosque(): NearestMosque | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const mosque = JSON.parse(cached) as NearestMosque;
      if (Date.now() - mosque.lastFetched < CACHE_DURATION) {
        return mosque;
      }
    }
  } catch (e) {
    console.error('Error reading mosque cache:', e);
  }
  return null;
}

export function cacheMosque(mosque: NearestMosque): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(mosque));
  } catch (e) {
    console.error('Error caching mosque:', e);
  }
}

export async function findNearestMosque(lat: number, lng: number): Promise<NearestMosque | null> {
  const cached = getCachedMosque();

  // Return cached result immediately if close enough and fresh
  if (cached) {
    const distanceFromCache = calculateDistance(lat, lng, cached.lat, cached.lng);
    if (distanceFromCache < 1 && Date.now() - cached.lastFetched < CACHE_DURATION) {
      return cached;
    }
  }

  // Offline check
  if (!navigator.onLine) {
    console.log('Offline: returning cached mosque data if available');
    return cached || null;
  }

  try {
    const radius = 5000;
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lng});
        way["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lng});
      );
      out center;
    `;

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `data=${encodeURIComponent(query)}`,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch mosques');
    }

    const data = await response.json();

    if (!data.elements || data.elements.length === 0) {
      return cached || null;
    }

    let nearest: NearestMosque | null = null;
    let minDistance = Infinity;

    for (const element of data.elements) {
      const mosqueLat = element.lat || element.center?.lat;
      const mosqueLng = element.lon || element.center?.lon;

      if (!mosqueLat || !mosqueLng) continue;

      const distance = calculateDistance(lat, lng, mosqueLat, mosqueLng);

      if (distance < minDistance) {
        minDistance = distance;
        const name = element.tags?.name || element.tags?.['name:ar'] || 'مسجد';
        nearest = {
          id: element.id.toString(),
          name: name,
          lat: mosqueLat,
          lng: mosqueLng,
          distance: Math.round(distance * 1000),
          lastFetched: Date.now(),
        };
      }
    }

    if (nearest) {
      cacheMosque(nearest);
    }

    return nearest || cached || null;
  } catch (error) {
    console.error('Error finding nearest mosque:', error);
    return cached || null;
  }
}

export function getGoogleMapsUrl(lat: number, lng: number, name?: string): string {
  const query = name ? encodeURIComponent(name) : `${lat},${lng}`;
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

export function getDirectionsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`;
}
