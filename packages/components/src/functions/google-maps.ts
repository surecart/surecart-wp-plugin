/**
 * Internal dependencies.
 */
import { CountryLocaleField, CountryLocaleFieldValue } from 'src/types';
import { getCountryDetails } from './address';

/**
 * Sorts address fields based on the provided country code and the default country fields.
 *
 * @param countryCode
 * @param defaultCountryFields
 * @param countryFields
 *
 * @returns {Array<CountryLocaleFieldValue>} The sorted address fields.
 */
export function sortAddressFields(countryCode: string, defaultCountryFields: Array<CountryLocaleFieldValue>, countryFields: Array<CountryLocaleField>) {
  const fields = defaultCountryFields || [];
  const fieldsByCountry = countryFields || {};

  if (countryCode && fieldsByCountry?.[countryCode]) {
    fields.forEach(field => {
      if (fieldsByCountry?.[countryCode]?.[field?.name]) {
        const countryField = fieldsByCountry[countryCode][field.name];
        field.priority = countryField?.priority || field?.priority;
        field.label = countryField?.label || field?.label;
      }
    });
  }

  return fields.sort((a, b) => a.priority - b.priority);
}

/**
 * Fetch the user's geolocation using the Google Geolocation API.
 *
 * @returns {Promise<string | null>} The user's country code.
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
 *
 * @param {number} lat - The latitude of the location.
 * @param {number} lng - The longitude of the location.
 * @returns {Promise<any>} The response from the Google Geocode API.
 */
async function fetchCountryFromCoordinates(lat: number, lng: number) {
  const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${window?.scData?.google_map_api_key}`);
  return response.json();
}

/**
 * Get the user's country code based on Google Geolocation and GeoCode APIs.
 * Caches the result in sessionStorage to avoid repeat API calls.
 *
 * @returns {Promise<string | null>} The user's country code.
 */
export async function getCurrentUserCountryCode() {
  if (!window?.scData?.google_map_api_key) {
    return null;
  }

  const cached = sessionStorage.getItem('sc_user_country');
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
      sessionStorage.setItem('sc_user_country', countryCode);
    }
    return countryCode;
  } catch {
    return null;
  }
}

/**
 * Get the regions for a given country using the Atlas API.
 *
 * @param country
 * @returns {Array<{ value: string, label: string }>} The regions for the specified country.
 */
export async function getCountryRegions(country: string) {
  if (!country) {
    return [];
  }

  const details = await getCountryDetails(country);
  return (details?.states || []).map((state: { code: string; name: string }) => ({
    value: state.code,
    label: state.name,
  }));
}
