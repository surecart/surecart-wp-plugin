import { Price, Product } from '../../types';
import apiFetch from '../../functions/fetch';
import { addQueryArgs } from '@wordpress/url';
const path = 'checkout-engine/v1/products/';

export const getPricesAndProducts = async ({ ids, active = true }: { ids: Array<string>; active: boolean }) => {
  const prices = (await apiFetch({
    path: addQueryArgs('checkout-engine/v1/prices/', {
      ids,
      active,
    }),
  })) as Array<Price>;

  const products = prices.map(price => {
    return price.product;
  });

  let productsResult;
  const map = new Map();
  for (const item of products) {
    if (!map.has(item.id)) {
      map.set(item.id, true); // set any value to Map
      productsResult.push({
        ...item,
      });
    }
  }

  // return normalized products and prices
  return {
    products: Array.from(productsResult),
    prices: prices.map(price => {
      price.product_id = price.product.id;
      delete price.product;
      return price;
    }),
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
