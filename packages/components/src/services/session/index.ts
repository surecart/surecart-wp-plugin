import { CheckoutSession } from '../../types';
import apiFetch from '../../functions/fetch';
import { addQueryArgs } from '@wordpress/url';
const baseUrl = 'checkout-engine/v1/checkout_sessions/';
const expand = ['line_items', 'line_item.price', 'price.product', 'customer', 'payment_intent', 'discount', 'discount.promotion'];

export const parsePath = (id, endpoint = '') => {
  let path = id ? `${baseUrl}${id}` : baseUrl;
  path = `${path}${endpoint}`;
  return addQueryArgs(path, {
    expand,
  });
};

export const getOrCreateSession = async ({ id, data }) => {
  return await apiFetch({
    method: id ? 'GET' : 'POST', // create or update
    path: parsePath(id),
    ...(data && !id ? { data } : {}),
  });
};

export const createOrUpdateSession = async ({ id, data }) => {
  return await apiFetch({
    method: id ? 'PATCH' : 'POST', // create or update
    path: parsePath(id),
    data,
  });
};

/**
 * Finalize a checkout session
 */
export const finalizeSession = async ({ id, data = {}, processor }) => {
  return (await apiFetch({
    method: 'POST',
    path: parsePath(id, `/finalize/${processor}`),
    data,
  })) as CheckoutSession;
};

export const getSession = async id => {
  return (await apiFetch({
    path: parsePath(id),
  })) as CheckoutSession;
};
