import { GeoCoordinates } from '../types';

/**
 * Get the customer's coordinates via the browser Geolocation API.
 * The browser prompts for permission if not already granted; resolves
 * null when denied, unsupported, or the lookup fails — never throws.
 */
export const getGeoCoordinates = async (): Promise<GeoCoordinates | null> => {
  try {
    if (!navigator?.geolocation) {
      return null;
    }

    return await new Promise<GeoCoordinates | null>(resolve => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => resolve({ latitude: coords.latitude, longitude: coords.longitude }),
        () => resolve(null),
        { maximumAge: 15 * 60 * 1000, timeout: 10000 },
      );
    });
  } catch {
    return null;
  }
};
