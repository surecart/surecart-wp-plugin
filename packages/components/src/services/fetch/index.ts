import { Price, Product } from '../../types';
import apiFetch from '../../functions/fetch';
import { addQueryArgs } from '@wordpress/url';
const path = 'checkout-engine/v1/products/';

import { normalizePrices } from '../../../../../resources/scripts/schema';

export const getPricesAndProducts = async ({ ids, active = true }: { ids: Array<string>; active: boolean }) => {
  const prices = (await apiFetch({
    path: addQueryArgs('checkout-engine/v1/prices/', {
      ids,
      active,
      expand: ['product'],
    }),
  })) as Array<Price>;

  const { entities } = normalizePrices(prices);
  return {
    prices: entities.prices,
    products: entities.products,
  };
};

/**
 * Get prices
 */
export const getProducts = async ({ query }: { query: Object }) => {
  return (await apiFetch({
    path: addQueryArgs(path, query),
  })) as Array<Product>;
};
