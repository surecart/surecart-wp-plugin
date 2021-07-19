import { CheckoutSession } from '../../types';
import apiFetch from '../../functions/fetch';
const path = 'checkout-engine/v1/checkout_sessions/';

/**
 * Update a checkout session.
 */
export const updateSession = async ({ id, data }) => {
  return (await apiFetch({
    method: 'PATCH', // create or update
    path: path + id,
    data,
  })) as CheckoutSession;
};

/**
 * Create a checkout session.
 */
export const createSession = async data => {
  return (await apiFetch({
    method: 'POST',
    path,
    data,
  })) as CheckoutSession;
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
