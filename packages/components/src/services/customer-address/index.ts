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
 * The structured address fields that count as "real" content. Country is intentionally
 * excluded — it's auto-detected from the user's IP and pushed to the checkout before
 * autofill runs, so treating it as filled-in data would block the autofill from ever
 * applying. Any other keys an API response might attach (id, object, created_at, etc.)
 * are also ignored, so the checks aren't fooled by metadata.
 */
const ADDRESS_CONTENT_FIELDS: Array<keyof Address> = ['name', 'line_1', 'line_2', 'city', 'state', 'postal_code'];

/**
 * Returns true when the address has no meaningful fields set.
 */
export const isAddressEmpty = (address: Partial<Address> | null | undefined): boolean => {
  if (!address) return true;
  return ADDRESS_CONTENT_FIELDS.every(key => !address[key]);
};

/**
 * Returns true when the value carries any meaningful address content. The API returns
 * `[]` when no address is stored, so arrays are treated as empty.
 */
export const hasAddressData = (value: Partial<Address> | [] | null | undefined): value is Partial<Address> => {
  if (!value || Array.isArray(value)) return false;
  return ADDRESS_CONTENT_FIELDS.some(key => !!value[key]);
};
