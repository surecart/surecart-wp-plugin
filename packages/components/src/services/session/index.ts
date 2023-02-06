import apiFetch from '../../functions/fetch';
import { Checkout, DeletedItem, LineItem } from '../../types';
import { addQueryArgs } from '@wordpress/url';
import { __ } from '@wordpress/i18n';

export const baseUrl = 'surecart/v1/checkouts/';
export const expand = [
  'line_items',
  'line_item.price',
  'price.product',
  'customer',
  'customer.shipping_address',
  'payment_intent',
  'discount',
  'discount.promotion',
  'recommended_bumps',
  'bump.price',
  'discount.coupon',
  'shipping_address',
  'staged_payment_intents',
  'tax_identifier',
];

export const parsePath = (id, endpoint = '') => {
  let path = id ? `${baseUrl}${id}` : baseUrl;
  path = `${path}${endpoint}`;
  return addQueryArgs(path, {
    expand,
  });
};

export const createOrUpdateSession = async ({ id = null, data, query = {} }) => {
  return await apiFetch({
    method: id ? 'PATCH' : 'POST', // create or update
    path: addQueryArgs(parsePath(id), query),
    data,
  });
};

export const createOrUpdateOrder = async ({ id = null, data = {}, query = {} }) => {
  return await apiFetch({
    method: id ? 'PATCH' : 'POST', // create or update
    path: addQueryArgs(parsePath(id), query),
    data,
  });
};

export const updateOrder = async ({ id, data = {}, query = {} }) => {
  return await apiFetch({
    method: 'PATCH',
    path: addQueryArgs(parsePath(id), query),
    data,
  });
};

export const getCheckout = async ({ id, query = {} }) => {
  return await apiFetch({
    path: addQueryArgs(parsePath(id), query),
  });
};

/**
 * Finalize a checkout session
 */
export const finalizeSession = async ({ id, data = {}, query = {}, processor }: { id: string; data?: any; query?: any; processor: { id: string; manual: boolean } }) => {
  return (await apiFetch({
    method: 'POST',
    path: addQueryArgs(parsePath(id, '/finalize'), {
      ...(processor?.manual ? { manual_payment: true, manual_payment_method_id: processor?.id } : { processor_type: processor?.id }),
      ...query,
    }),
    data,
  })) as Checkout;
};

export const getSession = async id => {
  return (await apiFetch({
    path: parsePath(id),
  })) as Checkout;
};

export const fetchCheckout = async ({ id, query = {} }) => {
  return (await apiFetch({
    path: addQueryArgs(parsePath(id), query),
  })) as Checkout;
};

export const requestSession = async ({ id, query = {} }) => {
  return apiFetch({
    path: addQueryArgs(`${baseUrl}${id}`, query),
  });
};

/**
 * Add a line item.
 */
export const addLineItem = async ({ checkout, data, live_mode = false }) => {
  // create the checkout with the line item.
  if (!checkout?.id) {
    return (await apiFetch({
      method: 'POST', // create
      path: addQueryArgs(parsePath(null)),
      data: {
        line_items: [data],
        live_mode,
      },
    })) as Checkout;
  }

  const item = (await apiFetch({
    path: addQueryArgs('surecart/v1/line_items', {
      consolidate: true,
      expand: [
        ...(expand || []).map(item => {
          return item.includes('.') ? item : `checkout.${item}`;
        }),
        'checkout',
      ],
    }),
    method: 'POST',
    data: {
      ...data,
      checkout: checkout.id,
    },
  })) as LineItem;

  return item?.checkout as Checkout;
};

/**
 * Remove a line item.
 */
export const removeLineItem = async ({ checkoutId, itemId }) => {
  const { deleted } = (await apiFetch({
    path: `surecart/v1/line_items/${itemId}`,
    method: 'DELETE',
  })) as DeletedItem;

  if (!deleted) {
    throw { code: 'error', message: __('Failed to delete', 'surecart') };
  }

  return await getSession(checkoutId);
};

/**
 * Update a line item.
 */
export const updateLineItem = async ({ id, data }) => {
  const item = (await apiFetch({
    path: addQueryArgs(`surecart/v1/line_items/${id}`, {
      expand: [
        ...(expand || []).map(item => {
          return item.includes('.') ? item : `checkout.${item}`;
        }),
        'checkout',
      ],
    }),
    method: 'PATCH',
    data,
  })) as LineItem;

  return item?.checkout as Checkout;
};
