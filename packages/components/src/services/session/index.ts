import apiFetch from '../../functions/fetch';
import { Order } from '../../types';
import { addQueryArgs } from '@wordpress/url';

export const baseUrl = 'surecart/v1/orders/';
const expand = [
  'line_items',
  'line_item.price',
  'price.product',
  'customer',
  'customer.shipping_address',
  'payment_intent',
  'discount',
  'discount.promotion',
  'discount.coupon',
  'shipping_address',
  'tax_identifier',
];

export const parsePath = (id, endpoint = '') => {
  let path = id ? `${baseUrl}${id}` : baseUrl;
  path = `${path}${endpoint}`;
  return addQueryArgs(path, {
    expand,
  });
};

export const createOrUpdateSession = async ({ id, data, query = {} }) => {
  return await apiFetch({
    method: id ? 'PATCH' : 'POST', // create or update
    path: addQueryArgs(parsePath(id), query),
    data,
  });
};

export const createOrUpdateOrder = async ({ id, data = {}, query = {} }) => {
  return await apiFetch({
    method: id ? 'PATCH' : 'POST', // create or update
    path: addQueryArgs(parsePath(id), query),
    data,
  });
};

/**
 * Finalize a checkout session
 */
export const finalizeSession = async ({ id, data = {}, query = {}, processor }) => {
  return (await apiFetch({
    method: 'POST',
    path: addQueryArgs(parsePath(id, `/finalize/`), {
      processor_type: processor,
      ...query,
    }),
    data,
  })) as Order;
};

export const getSession = async id => {
  return (await apiFetch({
    path: parsePath(id),
  })) as Order;
};

export const requestSession = async ({ id, query = {} }) => {
  return apiFetch({
    path: addQueryArgs(`${baseUrl}${id}`, query),
  });
};
