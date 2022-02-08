import { normalizeEntities } from '../../../../admin/schema';
import apiFetch from '../../functions/fetch';
import { Price, Product } from '../../types';
import { addQueryArgs } from '@wordpress/url';

const path = 'checkout-engine/v1/products/';

export const getPricesAndProducts = async ({ ids, active = true }: { ids: Array<string>; active: boolean }) => {
  const prices = (await apiFetch({
    path: addQueryArgs('checkout-engine/v1/prices/', {
      ids,
      active,
      expand: ['product'],
    }),
  })) as Array<Price>;

  const { entities } = normalizeEntities(prices);
  return {
    prices: entities.price,
    products: entities.product,
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
