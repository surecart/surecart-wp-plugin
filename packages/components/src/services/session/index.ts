import { CheckoutSession } from '../../types';
import apiFetch from '../../functions/fetch';
const path = 'checkout-engine/v1/checkout_sessions/';

export const getOrCreateSession = async ({ id, data }) => {
  return await apiFetch({
    method: id ? 'GET' : 'POST', // create or update
    path: id ? path + id : path,
    ...(data && !id ? { data } : {}),
  });
};

export const createOrUpdateSession = async ({ id, data }) => {
  return await apiFetch({
    method: id ? 'PATCH' : 'POST', // create or update
    path: id ? path + id : path,
    data,
  });
};

/**
 * Finalize a checkout session
 */
export const finalizeSession = async ({ id, data, processor }) => {
  return (await apiFetch({
    method: 'POST',
    path: `${path}${id}/finalize/${processor}`,
    data,
  })) as CheckoutSession;
};

export const getSession = async id => {
  return (await apiFetch({
    path: path + id,
  })) as CheckoutSession;
};
