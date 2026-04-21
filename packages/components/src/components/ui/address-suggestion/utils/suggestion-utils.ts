import { Address, AddressSuggestion, GoogleMapPlace } from 'src/types';
import { getAddressLabels, transformPlaceDetails, getStreetAddress } from 'src/functions/google-maps';
import { getCountryRegions } from 'src/functions/address';

const HTML_ESCAPE_MAP: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escapeHtml = (s: string) => s.replace(/[&<>"']/g, c => HTML_ESCAPE_MAP[c]);
const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Highlights the matching parts of a text based on a query.
 */
export function highlightMatch(text: string, query: string): string {
  if (!text || !query) {
    return escapeHtml(text || '');
  }

  const safeText = escapeHtml(text);
  const words = query
    .split(/\s+/)
    .filter(word => word)
    .map(escapeRegex);

  if (words.length === 0) {
    return safeText;
  }

  try {
    const regex = new RegExp(`(${words.join('|')})`, 'gi');
    return safeText.replace(regex, '<strong>$1</strong>');
  } catch (error) {
    return safeText;
  }
}

/**
 * Fetches address suggestions from the Google Maps API.
 */
export async function fetchAddressSuggestions(
  input: string,
  country: string | null,
  regions: Array<{ value: string; label: string }>,
  signal?: AbortSignal,
): Promise<Array<AddressSuggestion>> {
  const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': window?.scData?.google_map_api_key,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.types,places.primaryType,places.primaryTypeDisplayName,places.addressComponents',
    },
    body: JSON.stringify({
      textQuery: input,
      pageSize: 5,
      regionCode: country,
    }),
    signal,
  });

  const addressResponse = await response.json();

  if (addressResponse?.error?.message) {
    throw new Error(addressResponse.error.message);
  }

  return (addressResponse?.places || []).map((place: GoogleMapPlace) => {
    const { city, state, country } = getAddressLabels(place?.addressComponents || [], regions);

    return {
      displayName: place?.displayName?.text ?? input,
      fullDisplayName: [place?.displayName?.text ?? input, city, state, country].filter(Boolean).join(', '),
      placeId: place?.id,
      addressComponents: place?.addressComponents || null,
    };
  });
}

/**
 * Returns a full replacement address — preserves recipient name only, does not merge with the
 * previous address. Merging would leak stale line_2/city/postal_code when the new place omits them.
 */
export function buildReplacementAddressFromPlace(
  place: AddressSuggestion,
  regions: Array<{ value: string; label: string }>,
  previousName: string | null | undefined,
): Partial<Address> {
  if (!place?.addressComponents?.length) {
    throw new Error('Place details not found.');
  }

  const placeDetails = transformPlaceDetails(place.addressComponents, regions);
  const line1 = getStreetAddress(place.addressComponents) || place.displayName || '';

  return {
    name: previousName ?? null,
    line_1: line1,
    line_2: placeDetails.line_2 ?? null,
    city: placeDetails.city ?? null,
    state: placeDetails.state ?? null,
    postal_code: placeDetails.postal_code ?? null,
    country: placeDetails.country ?? null,
  };
}

/**
 * Fetches place details from the Google Maps API.
 */
export async function fetchPlaceDetails(
  placeId: string,
  addressSuggestions: Array<AddressSuggestion>,
  address: Partial<Address>,
  regions: Array<{ value: string; label: string }>,
): Promise<{ updatedAddress: Partial<Address>; updatedRegions: Array<{ value: string; label: string }> }> {
  const place = addressSuggestions.find((suggestion: AddressSuggestion) => suggestion.placeId === placeId);
  if (!place?.addressComponents) {
    throw new Error('Place details not found.');
  }

  const { addressComponents } = place;
  const country = addressComponents.find(component => component.types?.includes('country'))?.shortText || null;
  const updatedRegions = address?.country !== country ? await getCountryRegions(country) : regions;

  return {
    updatedAddress: buildReplacementAddressFromPlace(place, updatedRegions, address.name),
    updatedRegions,
  };
}
