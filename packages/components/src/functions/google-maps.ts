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
 * Get the state only if it exists in our regions list and matches the value.
 */
const getState = (addressComponents: Array<GoogleMapAddressComponents>, regions: Array<{ value: string; label: string }>) => {
  const administrativeAreaLevel1 = findAddressComponent(addressComponents, 'administrative_area_level_1') ?? null;
  const region = regions?.find(region => region.value === administrativeAreaLevel1?.shortText);
  if (!region) {
    return {
      longText: administrativeAreaLevel1?.longText || null, // for preview in the address suggestion.
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
