import { Address, CustomerAddressData } from '../../types';
import apiFetch from '../../functions/fetch';
import { addQueryArgs } from '@wordpress/url';

const path = 'surecart/v1/customer-addresses';

/**
 * Fetch the logged-in customer's addresses and profile.
 */
export const getCustomerAddresses = (mode: 'live' | 'test' = 'live') => apiFetch({ path: addQueryArgs(path, { mode }) }) as Promise<CustomerAddressData>;

/**
 * Returns true when the address has no meaningful fields set (country is ignored
 * because it can be pre-filled from a storefront default).
 */
export const isAddressEmpty = (address: Partial<Address> | null | undefined): boolean => {
  if (!address) return true;
  return (Object.keys(address) as Array<keyof Address>).filter(key => key !== 'country').every(key => !address[key]);
};

/**
 * Returns true when the value is a non-empty address object (the API returns [] when
 * no address is stored, so arrays are treated as empty).
 */
export const hasAddressData = (value: Partial<Address> | [] | null | undefined): value is Partial<Address> => {
  return !!value && !Array.isArray(value) && Object.keys(value).length > 0;
};
