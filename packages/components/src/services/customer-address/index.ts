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

// Content fields only. Country is excluded here because it's IP-detected and pushed before
// autofill runs — it must not make the checkout's address look "non-empty" and block autofill.
const ADDRESS_CONTENT_FIELDS: Array<keyof Address> = ['name', 'line_1', 'line_2', 'city', 'state', 'postal_code'];

// Fields that count as the customer having a saved address worth autofilling. Country is
// included here: a customer may have only a saved country (and no street/city yet), and we
// still want that country carried into the checkout.
const ADDRESS_DATA_FIELDS: Array<keyof Address> = [...ADDRESS_CONTENT_FIELDS, 'country'];

/** True when the address has no meaningful content fields set (country ignored — see above). */
export const isAddressEmpty = (address: Partial<Address> | null | undefined): boolean => {
  if (!address) return true;
  return ADDRESS_CONTENT_FIELDS.every(key => !address[key]);
};

/** True when the value carries any saved address data, including a country-only address. API returns `[]` for "none" — treat as empty. */
export const hasAddressData = (value: Partial<Address> | [] | null | undefined): value is Partial<Address> => {
  if (!value || Array.isArray(value)) return false;
  return ADDRESS_DATA_FIELDS.some(key => !!value[key]);
};
