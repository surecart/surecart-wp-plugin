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
  { value: 'AU', label: __('Australia', 'checkout_engine') },
  { value: 'BE', label: __('Belgium', 'checkout_engine') },
  { value: 'BR', label: __('Brazil', 'checkout_engine') },
  { value: 'BG', label: __('Bulgaria', 'checkout_engine') },
  { value: 'CA', label: __('Canada', 'checkout_engine') },
  { value: 'CN', label: __('China', 'checkout_engine') },
  { value: 'CY', label: __('Cyprus', 'checkout_engine') },
  { value: 'CZ', label: __('Czechia', 'checkout_engine') },
  { value: 'DK', label: __('Denmark', 'checkout_engine') },
  { value: 'EE', label: __('Estonia', 'checkout_engine') },
  { value: 'FI', label: __('Finland', 'checkout_engine') },
  { value: 'FR', label: __('France', 'checkout_engine') },
  { value: 'DE', label: __('Germany', 'checkout_engine') },
  { value: 'GR', label: __('Greece', 'checkout_engine') },
  { value: 'HK', label: __('Hong Kong', 'checkout_engine') },
  { value: 'IN', label: __('India', 'checkout_engine') },
  { value: 'IE', label: __('Ireland', 'checkout_engine') },
  { value: 'IT', label: __('Italy', 'checkout_engine') },
  { value: 'JP', label: __('Japan', 'checkout_engine') },
  { value: 'LV', label: __('Latvia', 'checkout_engine') },
  { value: 'LT', label: __('Lithuania', 'checkout_engine') },
  { value: 'LU', label: __('Luxembourg', 'checkout_engine') },
  { value: 'MY', label: __('Malaysia', 'checkout_engine') },
  { value: 'MT', label: __('Malta', 'checkout_engine') },
  { value: 'MX', label: __('Mexico', 'checkout_engine') },
  { value: 'NL', label: __('Netherlands', 'checkout_engine') },
  { value: 'NZ', label: __('New Zealand', 'checkout_engine') },
  { value: 'NO', label: __('Norway', 'checkout_engine') },
  { value: 'PL', label: __('Poland', 'checkout_engine') },
  { value: 'PT', label: __('Portugal', 'checkout_engine') },
  { value: 'RO', label: __('Romania', 'checkout_engine') },
  { value: 'SG', label: __('Singapore', 'checkout_engine') },
  { value: 'SK', label: __('Slovakia', 'checkout_engine') },
  { value: 'SI', label: __('Slovenia', 'checkout_engine') },
  { value: 'ES', label: __('Spain', 'checkout_engine') },
  { value: 'SE', label: __('Sweden', 'checkout_engine') },
  { value: 'CH', label: __('Switzerland', 'checkout_engine') },
  { value: 'GB', label: __('United Kingdom', 'checkout_engine') },
  { value: 'US', label: __('United States', 'checkout_engine') },
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
