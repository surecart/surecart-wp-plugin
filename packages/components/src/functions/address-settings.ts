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

/**
 * Get the user's country code based on Google Geolocation and GeoCode APIs.
 *
 * @returns {Promise<string | null>} The user's country code.
 */
export async function getCurrentUserCountryCode() {
  // If already set user country or Google Map API key is not set, return.
  if (!window?.scData?.google_map_api_key) {
    return null;
  }

  // Search for the user's country.
  const geoLocateResponse = await fetch('https://www.googleapis.com/geolocation/v1/geolocate?key=' + window?.scData?.google_map_api_key, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      considerIp: true,
    }),
  });

  const userCountryResponse = await geoLocateResponse.json();
  if (!userCountryResponse?.location) {
    return null;
  }

  // Fetch the country name from the coordinates.
  const { lat, lng } = userCountryResponse.location;

  const countryResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${window?.scData?.google_map_api_key}`);
  const countryData = await countryResponse.json();

  // If some error occurred, return.
  if (countryData?.error_message) {
    return null;
  }

  // Find the country from the address components.
  return countryData?.results?.[0]?.address_components?.find(component => component.types.includes('country'))?.short_name || null;
}
