/**
 * Internal dependencies.
 */
import { Address, GoogleMapAddressComponents } from 'src/types';

/**
 * Helper function to find an address component by type.
 */
const findAddressComponent = (addressComponents: Array<GoogleMapAddressComponents>, type: string): GoogleMapAddressComponents | undefined => {
  return (addressComponents || []).find(component => component.types?.includes(type));
};

/**
 * Find the city from address components using a fallback chain.
 *
 * Google Places API returns the city under different component types depending on the country:
 * - `locality` — most countries (e.g. US, CA, AU)
 * - `administrative_area_level_2` — Brazil (município), parts of Italy, etc.
 * - `postal_town` — UK, Sweden, and some other European countries
 */
const findCity = (addressComponents: Array<GoogleMapAddressComponents>): GoogleMapAddressComponents | undefined => {
  return (
    findAddressComponent(addressComponents, 'locality') ??
    findAddressComponent(addressComponents, 'administrative_area_level_2') ??
    findAddressComponent(addressComponents, 'postal_town')
  );
};

/**
 * Build a street address from address components (street_number + route).
 */
export function getStreetAddress(addressComponents: Array<GoogleMapAddressComponents> | null): string {
  if (!addressComponents) return '';
  const streetNumber = findAddressComponent(addressComponents, 'street_number')?.longText || '';
  const route = findAddressComponent(addressComponents, 'route')?.longText || '';
  return [streetNumber, route].filter(Boolean).join(' ');
}

/**
 * Normalize a string for fuzzy matching:
 *  - strip trailing periods (Google abbreviates, e.g. "Yuc." for "Yucatán")
 *  - remove diacritics (Google may return "Yucatan" while we store "Yucatán")
 *  - lowercase
 */
const normalizeForMatch = (value: string | null | undefined): string =>
  (value || '')
    .replace(/\.$/, '')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

/**
 * Try to find a matching region from a Google address component.
 *
 * Match precedence:
 *  1. component.shortText === region.value  (exact code match)
 *  2. component.longText  ≈  region.label   (case-insensitive label match)
 */
const findRegionMatch = (
  component: GoogleMapAddressComponents | null | undefined,
  regions: Array<{ value: string; label: string }>,
): { value: string; label: string } | undefined => {
  if (!component || !regions?.length) return undefined;

  // 1. Exact code match (e.g. "GO" === "GO", "RM" === "RM").
  const byCode = regions.find(r => r.value === component.shortText);
  if (byCode) return byCode;

  // 2. Case-insensitive label match (e.g. "Yucatán" ≈ "Yucatán").
  const normalizedLong = normalizeForMatch(component.longText);
  if (normalizedLong) {
    const byLabel = regions.find(r => normalizeForMatch(r.label) === normalizedLong);
    if (byLabel) return byLabel;
  }

  return undefined;
};

/**
 * Get the state/province from address components using a fallback chain.
 *
 * Google Places maps states/provinces to different administrative levels depending on the country:
 *  - `administrative_area_level_1` — most countries (US, BR, CA, AU, MX)
 *  - `administrative_area_level_2` — Spain (province codes like "B"), Italy (province codes like "RM")
 *
 * For some countries (e.g. Mexico) the shortText is abbreviated ("Yuc.") while SureCart stores
 * ISO codes ("YUC"), so we also attempt a label-based match using the longText.
 */
const getState = (addressComponents: Array<GoogleMapAddressComponents>, regions: Array<{ value: string; label: string }>) => {
  const adminLevel1 = findAddressComponent(addressComponents, 'administrative_area_level_1') ?? null;
  const adminLevel2 = findAddressComponent(addressComponents, 'administrative_area_level_2') ?? null;

  // Try level 1 first (covers US, BR, CA, AU, MX, etc.), then fall back to level 2 (covers ES, IT).
  const region = findRegionMatch(adminLevel1, regions) ?? findRegionMatch(adminLevel2, regions);

  if (!region) {
    return {
      longText: adminLevel1?.longText || null, // for preview in the address suggestion.
      shortText: null,
    };
  }

  return {
    shortText: region.value,
    longText: region.label,
  };
};

/**
 * Transforms the place address components into an address object.
 */
export function transformPlaceDetails(addressComponents: Array<GoogleMapAddressComponents>, regions: Array<{ value: string; label: string }>): Address {
  return {
    line_2: findAddressComponent(addressComponents, 'sublocality')?.shortText || null,
    postal_code: findAddressComponent(addressComponents, 'postal_code')?.shortText || null,
    city: findCity(addressComponents)?.longText || null,
    state: getState(addressComponents, regions)?.shortText || null,
    country: findAddressComponent(addressComponents, 'country')?.shortText || null,
  };
}

/**
 * Transforms the place address components into an address object for display.
 */
export function getAddressLabels(
  addressComponents: Array<GoogleMapAddressComponents>,
  regions: Array<{ value: string; label: string }>,
): { country: string | null; state: string | null; city: string | null } {
  const country = findAddressComponent(addressComponents, 'country') ?? null;
  if (!country) {
    return {
      country: null,
      state: null,
      city: null,
    };
  }

  const state = getState(addressComponents, regions);
  const labels = {
    country: country.longText || null,
    state: state?.longText || null,
    city: findCity(addressComponents)?.longText || null,
  };

  switch (country?.shortText) {
    case 'US':
      return {
        ...labels,
        country: 'USA',
        state: state?.shortText || null,
      };

    case 'GB':
      return {
        ...labels,
        country: 'UK',
      };

    default:
      return labels;
  }
}

/**
 * Fetch the user's geolocation using the Google Geolocation API.
 */
async function fetchGeoLocation() {
  const response = await fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=${window?.scData?.google_map_api_key}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      considerIp: true,
    }),
  });
  return response.json();
}

/**
 * Fetch the country information based on latitude and longitude using the Google Geocode API.
 */
async function fetchCountryFromCoordinates(lat: number, lng: number) {
  const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${window?.scData?.google_map_api_key}`);
  return response.json();
}

/**
 * Get the user's country code based on Google Geolocation and GeoCode APIs.
 * Caches the result in sessionStorage to avoid repeat API calls.
 */
export async function getCurrentUserCountryCode() {
  if (!window?.scData?.google_map_api_key) {
    return null;
  }

  const cached = sessionStorage.getItem('surecart_user_country');
  if (cached) return cached;

  try {
    const geoLocateResponse = await fetchGeoLocation();
    if (!geoLocateResponse?.location) {
      return null;
    }

    const { lat, lng } = geoLocateResponse.location;
    const countryData = await fetchCountryFromCoordinates(lat, lng);

    if (countryData?.error_message) {
      return null;
    }

    const countryCode = countryData?.results?.[0]?.address_components?.find(component => component.types.includes('country'))?.short_name || null;
    if (countryCode) {
      sessionStorage.setItem('surecart_user_country', countryCode);
    }
    return countryCode;
  } catch {
    return null;
  }
}
