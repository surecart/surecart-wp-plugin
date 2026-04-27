import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
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

const lang = window.scData?.locale || navigator.language || (navigator as any)?.browserLanguage || (navigator.languages || ['en'])[0];

let cachedCountryChoices: Array<{ value: string; label: string }> | null = null;
const countryDetailsCache = new Map<string, any>();

export const countryChoices = async () => {
  if (cachedCountryChoices) {
    return cachedCountryChoices;
  }

  const url = addQueryArgs(`https://api.surecart.com/v1/public/atlas`, {
    locale: lang,
  });
  const response = await fetch(url);
  const data: any = await response.json();
  const countries = (data?.data || [])?.map(({ code, name }) => ({ value: code, label: name })) as Array<{ value: string; label: string }>;
  cachedCountryChoices = (window?.wp?.hooks?.applyFilters?.('surecart_address_countries', countries) as Array<{ value: string; label: string }>) || countries;
  return cachedCountryChoices;
};

export const getCountryDetails = async (countryCode: string) => {
  if (countryDetailsCache.has(countryCode)) {
    return countryDetailsCache.get(countryCode);
  }

  const url = addQueryArgs(`https://api.surecart.com/v1/public/atlas/${countryCode}`, {
    locale: lang,
  });
  const response = await fetch(url);
  const details = await response.json();
  countryDetailsCache.set(countryCode, details);
  return details;
};

export const getCountryRegions = async (country: string) => {
  if (!country) {
    return [];
  }

  const details = await getCountryDetails(country);
  return (details?.states || []).map((state: { code: string; name: string }) => ({
    value: state.code,
    label: state.name,
  }));
};

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
