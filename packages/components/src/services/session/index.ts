import { CheckoutSession } from '../../types';
import apiFetch from '../../functions/fetch';
import { addQueryArgs } from '@wordpress/url';
export const baseUrl = 'checkout-engine/v1/checkout_sessions/';
const expand = ['line_items', 'line_item.price', 'price.product', 'customer', 'payment_intent', 'discount', 'discount.promotion', 'discount.coupon'];

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

/**
 * Finalize a checkout session
 */
export const finalizeSession = async ({ id, data = {}, query = {}, processor }) => {
  return (await apiFetch({
    method: 'POST',
    path: addQueryArgs(parsePath(id, `/finalize/${processor}`), query),
    data,
  })) as CheckoutSession;
};

export const getSession = async id => {
  return (await apiFetch({
    path: parsePath(id),
  })) as CheckoutSession;
};

export const requestSession = async ({ id, query = {} }) => {
  return apiFetch({
    path: addQueryArgs(`${baseUrl}${id}`, query),
  });
};
