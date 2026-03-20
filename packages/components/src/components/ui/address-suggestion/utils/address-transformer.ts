import { Address, GoogleMapAddressComponents } from 'src/types';

/**
 * Helper function to find an address component by type.
 */
const findAddressComponent = (addressComponents: Array<GoogleMapAddressComponents>, type: string): GoogleMapAddressComponents | undefined => {
  return (addressComponents || []).find(component => component.types?.includes(type));
};

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
    city: findAddressComponent(addressComponents, 'locality')?.longText || null,
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
  // For some countries, we'll send value as label, eg: for the US, we'll send its value as label.
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
    city: findAddressComponent(addressComponents, 'locality')?.longText || null,
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
