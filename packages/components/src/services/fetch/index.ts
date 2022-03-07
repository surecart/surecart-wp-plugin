import { normalizeEntities } from '../../../../admin/schema';
import apiFetch from '../../functions/fetch';
import { Price, Product } from '../../types';
import { addQueryArgs } from '@wordpress/url';

const path = 'checkout-engine/v1/products/';

export const getPricesAndProducts = async ({ ids, archived = false }: { ids: Array<string>; archived: boolean }) => {
  const prices = (await apiFetch({
    path: addQueryArgs('checkout-engine/v1/prices/', {
      ids,
      archived,
      expand: ['product'],
    }),
  })) as Array<Price>;

  return normalizePrices(prices);
};

export const normalizePrices = (prices: Array<Price>) => {
  const { entities } = normalizeEntities(prices);
  return {
    prices: entities?.price,
    products: entities?.product,
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
