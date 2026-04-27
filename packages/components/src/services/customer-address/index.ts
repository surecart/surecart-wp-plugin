import { Address, Customer } from '../../types';
import apiFetch from '../../functions/fetch';
import { addQueryArgs } from '@wordpress/url';

const path = 'surecart/v1/customers/me';

/**
 * Fetch the logged-in user's customer record (with addresses expanded).
 *
 * Resolves to `null` when the logged-in user has no linked customer yet.
 */
export const getCurrentCustomer = (mode: 'live' | 'test' = 'live') =>
  apiFetch({
    path: addQueryArgs(path, {
      mode,
      expand: ['shipping_address', 'billing_address'],
    }),
  }) as Promise<Customer | null>;

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
