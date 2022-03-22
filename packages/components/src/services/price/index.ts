import { Price } from '../../types';
import apiFetch from '../../functions/fetch';
import { addQueryArgs } from '@wordpress/url';
const path = 'surecart/v1/price/';

/**
 * Get prices
 */
export const getPrices = async ({ query, currencyCode = 'usd' }: { query: Object; currencyCode: string }) => {
  const res = (await apiFetch({
    path: addQueryArgs(path, query),
  })) as Array<Price>;

  // this does not allow prices with a different currency than provided.
  return res.filter(price => {
    return price.currency && price.currency === currencyCode;
  });
};
