import { Product } from '../../types';
import apiFetch from '../../functions/fetch';
import { addQueryArgs } from '@wordpress/url';
const path = 'checkout-engine/v1/products/';

/**
 * Get prices
 */
export const getProducts = async ({ query }: { query: Object }) => {
  return (await apiFetch({
    path: addQueryArgs(path, query),
  })) as Array<Product>;
};
