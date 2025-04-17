import { Address, AddressSuggestion, GoogleMapPlace } from 'src/types';
import { getAddressLabels, transformPlaceDetails } from './address-transformer';
import { getCountryRegions } from 'src/functions/address-settings';

/**
 * Highlights the matching parts of a text based on a query.
 */
export function highlightMatch(text: string, query: string): string {
  if (!text || !query) {
    return text;
  }

  const words = query.split(/\s+/).filter(word => word);

  if (words.length === 0) {
    return text;
  }

  try {
    const regex = new RegExp(`(${words.join('|')})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
  } catch (error) {
    console.error('Invalid regex in highlightMatch:', error);
    return text;
  }
}

/**
 * Updates the focus on a specific list element.
 */
export function updateFocus(listElement: HTMLElement, focusedIndex: number): void {
  const focusedItem = listElement?.children[focusedIndex] as HTMLElement;
  focusedItem?.focus();
}

/**
 * Fetches address suggestions from the Google Maps API.
 */
export async function fetchAddressSuggestions(input: string, country: string | null, regions: Array<{ value: string; label: string }>): Promise<Array<AddressSuggestion>> {
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
  });

  const addressResponse = await response.json();

  if (!!addressResponse?.error?.message) {
    throw new Error(addressResponse.error.message);
  }

  return (addressResponse?.places || []).map((place: GoogleMapPlace) => {
    const { city, state, country } = getAddressLabels(place?.addressComponents, regions);

    return {
      displayName: place?.displayName?.text ?? input,
      fullDisplayName: [place?.displayName?.text ?? input, city, state, country].filter(Boolean).join(', '),
      placeId: place?.id,
      addressComponents: place?.addressComponents || null,
    };
  });
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
  const country = addressComponents.find(component => component.types.includes('country'))?.shortText || null;
  const updatedRegions = address?.country !== country ? await getCountryRegions(country) : regions;
  const placeDetails = transformPlaceDetails(addressComponents, updatedRegions);

  return {
    updatedAddress: {
      ...address,
      ...placeDetails,
      line_1: place?.displayName ?? '',
    },
    updatedRegions,
  };
}
