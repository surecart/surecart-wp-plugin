import apiFetch from '../../functions/fetch';
import { Address } from '../../types';

export interface CustomerAddressData {
  shipping_address: Partial<Address> | [];
  billing_address: Partial<Address> | [];
  first_name: string;
  last_name: string;
  phone: string;
}

/** Cached promise to avoid duplicate fetches. */
let fetchPromise: Promise<CustomerAddressData> | null = null;

/** Cached result. */
let cachedData: CustomerAddressData | null = null;

/**
 * Fetch customer addresses from the dedicated API.
 * Caches the result so multiple components don't trigger separate requests.
 */
export const fetchCustomerAddresses = async (mode: 'live' | 'test' = 'live'): Promise<CustomerAddressData> => {
  // Return cached data if already fetched.
  if (cachedData) {
    return cachedData;
  }

  // Return existing in-flight request if one is pending.
  if (fetchPromise) {
    return fetchPromise;
  }

  fetchPromise = apiFetch({
    path: `surecart/v1/customer-addresses?mode=${mode}`,
    method: 'GET',
  }) as Promise<CustomerAddressData>;

  try {
    cachedData = await fetchPromise;
    return cachedData;
  } catch (e) {
    // Silently fail — auto-fill is a convenience, not critical.
    console.error('Failed to fetch customer addresses:', e);
    return {
      shipping_address: [],
      billing_address: [],
      first_name: '',
      last_name: '',
      phone: '',
    };
  } finally {
    fetchPromise = null;
  }
};

/**
 * Clear the cached customer address data.
 * Call this when the user logs out.
 */
export const clearCustomerAddressCache = () => {
  cachedData = null;
  fetchPromise = null;
};
