import { Address } from '../../types';
import apiFetch from '../../functions/fetch';
import { addQueryArgs } from '@wordpress/url';

const path = 'surecart/v1/customer-addresses';

export interface CustomerAddressData {
  shipping_address: Partial<Address> | [];
  billing_address: Partial<Address> | [];
  first_name: string;
  last_name: string;
  phone: string;
}

/**
 * Fetch the logged-in customer's addresses and profile.
 */
export const getCustomerAddresses = (mode: 'live' | 'test' = 'live') => apiFetch({ path: addQueryArgs(path, { mode }) }) as Promise<CustomerAddressData>;
