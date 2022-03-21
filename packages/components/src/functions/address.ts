import { __ } from '@wordpress/i18n';
import { Address } from '../types';

export const STATE_INCLUDED_COUNTRIES = ['AU', 'BR', 'CA', 'CH', 'ES', 'HK', 'IE', 'IN', 'IT', 'JP', 'MY', 'MX', 'US'];
export const POSTAL_CODE_EXCLUDED_COUNTRIES = ['HK'];
export const CITY_EXCLUDED_COUNTRIES = ['SG'];
import countries from './countries.json';

export const hasPostal = (countryCode: string) => {
  return !POSTAL_CODE_EXCLUDED_COUNTRIES.includes(countryCode);
};

export const hasCity = (countryCode: string) => {
  return !CITY_EXCLUDED_COUNTRIES.includes(countryCode);
};

export const hasState = (countryCode: string) => {
  return STATE_INCLUDED_COUNTRIES.includes(countryCode);
};

export const hasCompleteAddress = args => {
  const { country, state } = args;
  // does it have the fields filled out?
  if (!hasRequiredFields(args)) {
    return false;
  }
  return hasState(country) ? hasCorrectState(country, state) : true;
};

export const hasCorrectState = (country, state) => {
  return (countries?.[country] || ([] as Array<{ value: string; label: string }>)).some(({ value }) => value === state);
};

export const hasRequiredFields = ({ city, country, line_1, postal_code, state }) => {
  if (!country) {
    return false;
  }
  if (hasPostal(country) && !postal_code) {
    return false;
  }
  if (hasCity(country) && !city) {
    return false;
  }
  if (hasState(country) && !state) {
    return false;
  }
  return !!line_1;
};

export const countryChoices: Array<{ value: string; label: string }> = [
  { value: 'AU', label: __('Australia', 'surecart') },
  { value: 'BE', label: __('Belgium', 'surecart') },
  { value: 'BR', label: __('Brazil', 'surecart') },
  { value: 'BG', label: __('Bulgaria', 'surecart') },
  { value: 'CA', label: __('Canada', 'surecart') },
  { value: 'CN', label: __('China', 'surecart') },
  { value: 'CY', label: __('Cyprus', 'surecart') },
  { value: 'CZ', label: __('Czechia', 'surecart') },
  { value: 'DK', label: __('Denmark', 'surecart') },
  { value: 'EE', label: __('Estonia', 'surecart') },
  { value: 'FI', label: __('Finland', 'surecart') },
  { value: 'FR', label: __('France', 'surecart') },
  { value: 'DE', label: __('Germany', 'surecart') },
  { value: 'GR', label: __('Greece', 'surecart') },
  { value: 'HK', label: __('Hong Kong', 'surecart') },
  { value: 'IN', label: __('India', 'surecart') },
  { value: 'IE', label: __('Ireland', 'surecart') },
  { value: 'IT', label: __('Italy', 'surecart') },
  { value: 'JP', label: __('Japan', 'surecart') },
  { value: 'LV', label: __('Latvia', 'surecart') },
  { value: 'LT', label: __('Lithuania', 'surecart') },
  { value: 'LU', label: __('Luxembourg', 'surecart') },
  { value: 'MY', label: __('Malaysia', 'surecart') },
  { value: 'MT', label: __('Malta', 'surecart') },
  { value: 'MX', label: __('Mexico', 'surecart') },
  { value: 'NL', label: __('Netherlands', 'surecart') },
  { value: 'NZ', label: __('New Zealand', 'surecart') },
  { value: 'NO', label: __('Norway', 'surecart') },
  { value: 'PL', label: __('Poland', 'surecart') },
  { value: 'PT', label: __('Portugal', 'surecart') },
  { value: 'RO', label: __('Romania', 'surecart') },
  { value: 'SG', label: __('Singapore', 'surecart') },
  { value: 'SK', label: __('Slovakia', 'surecart') },
  { value: 'SI', label: __('Slovenia', 'surecart') },
  { value: 'ES', label: __('Spain', 'surecart') },
  { value: 'SE', label: __('Sweden', 'surecart') },
  { value: 'CH', label: __('Switzerland', 'surecart') },
  { value: 'GB', label: __('United Kingdom', 'surecart') },
  { value: 'US', label: __('United States', 'surecart') },
];

export const isAddressComplete = (address: Partial<Address>) => {
  return (
    address?.country && // must have country
    address?.line_1 && // must have line 1
    (hasPostal(address.country) ? address?.postal_code : true) && // should have postal code if applicable
    (hasCity(address.country) ? address?.city : true) && // should have city if applicable
    (hasState(address.country) ? address?.state : true) // should have state if applicable
  );
};

export const isAddressCompleteEnough = (address: Partial<Address>) => {
  return (
    address?.country && // must have country
    (hasPostal(address.country) ? address?.postal_code : true) && // should have postal code if applicable
    (hasCity(address.country) ? address?.city : true) && // should have city if applicable
    (hasState(address.country) ? address?.state : true) // should have state if applicable
  );
};
