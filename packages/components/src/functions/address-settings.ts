/**
 * Internal dependencies.
 */
import { CountryLocaleField, CountryLocaleFieldValue } from 'src/types';

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

async function fetchCountryFromCoordinates(lat: number, lng: number) {
  const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${window?.scData?.google_map_api_key}`);
  return response.json();
}

/**
 * Get the user's country code based on Google Geolocation and GeoCode APIs.
 *
 * @returns {Promise<string | null>} The user's country code.
 */
export async function getCurrentUserCountryCode() {
  if (!window?.scData?.google_map_api_key) {
    return null;
  }

  const geoLocateResponse = await fetchGeoLocation();
  if (!geoLocateResponse?.location) {
    return null;
  }

  const { lat, lng } = geoLocateResponse.location;
  const countryData = await fetchCountryFromCoordinates(lat, lng);

  if (countryData?.error_message) {
    return null;
  }

  return countryData?.results?.[0]?.address_components?.find(component => component.types.includes('country'))?.short_name || null;
}
