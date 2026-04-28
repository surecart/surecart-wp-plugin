import { Address, Customer } from '../../types';
import apiFetch from '../../functions/fetch';
import { addQueryArgs } from '@wordpress/url';

const path = 'surecart/v1/customers/me';

/** Fetch the current user's customer record. Resolves to `null` when no customer is linked. */
export const getCurrentCustomer = (mode: 'live' | 'test' = 'live') =>
  apiFetch({
    path: addQueryArgs(path, {
      mode,
      expand: ['shipping_address', 'billing_address'],
    }),
  }) as Promise<Customer | null>;

// Country is excluded — it's IP-detected and pushed before autofill runs, so it must not gate the check.
// Other API metadata (id, object, created_at, …) is ignored by virtue of the whitelist.
const ADDRESS_CONTENT_FIELDS: Array<keyof Address> = ['name', 'line_1', 'line_2', 'city', 'state', 'postal_code'];

/** True when the address has no meaningful content fields set. */
export const isAddressEmpty = (address: Partial<Address> | null | undefined): boolean => {
  if (!address) return true;
  return ADDRESS_CONTENT_FIELDS.every(key => !address[key]);
};

/** True when the value carries any meaningful address content. API returns `[]` for "none" — treat as empty. */
export const hasAddressData = (value: Partial<Address> | [] | null | undefined): value is Partial<Address> => {
  if (!value || Array.isArray(value)) return false;
  return ADDRESS_CONTENT_FIELDS.some(key => !!value[key]);
};
