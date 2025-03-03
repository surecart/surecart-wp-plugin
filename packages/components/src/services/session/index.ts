import { state as checkoutState } from '@store/checkout';
import { addQueryArgs, getQueryArg } from '@wordpress/url';

import apiFetch from '../../functions/fetch';
import { Checkout, DeletedItem, Invoice, LineItem } from '../../types';
import { __ } from '@wordpress/i18n';

/** The base url for this service. */
export const baseUrl = 'surecart/v1/checkouts/';

/** Items to always expand. */
export const expand = [
  'line_items',
  'line_item.price',
  'line_item.fees',
  'line_item.variant',
  'line_item.swap',
  'variant.image',
  'price.product',
  'price.current_swap',
  'product.product_medias',
  'product.featured_product_media',
  'product.product_collections',
  'product_media.media',
  'customer',
  'customer.shipping_address',
  'payment_intent',
  'discount',
  'discount.promotion',
  'recommended_bumps',
  'bump.price',
  'current_upsell',
  'product.variants',
  'discount.coupon',
  'shipping_address',
  'billing_address',
  'tax_identifier',
  'manual_payment_method',
  'shipping_choices',
  'shipping_choice.shipping_method',
  'invoice',
];

/** Default data we send with every request. */
export const withDefaultData = (data: { metadata?: any } = {}) => ({
  live_mode: checkoutState.mode !== 'test',
  group_key: checkoutState.groupId,
  abandoned_checkout_enabled: checkoutState.abandonedCheckoutEnabled,
  billing_matches_shipping: checkoutState.checkout?.billing_matches_shipping,
  metadata: {
    ...(data?.metadata || {}),
    ...(window?.scData?.page_id && { page_id: window?.scData?.page_id }),
    ...(checkoutState?.product?.id && { buy_page_product_id: checkoutState?.product?.id }),
    page_url: window.location.href,
  },
  ...(checkoutState?.checkout?.email && { email: checkoutState?.checkout?.email }),
  ...data,
});

/** Default query we send with every request. */
export const withDefaultQuery = (query = {}) => ({
  ...(!!checkoutState?.formId && { form_id: checkoutState?.formId }),
  ...(!!checkoutState?.product?.id && { product_id: checkoutState?.product?.id }),
  ...(!!(checkoutState?.checkout?.invoice as Invoice)?.id && { type: 'open_invoice' }),
  ...query,
});

/** Get the checkout id  */
export const findInitialCheckoutId = () => {
  // check url first.
  const checkoutId = getQueryArg(window.location.href, 'checkout_id');
  if (!!checkoutId) {
    return checkoutId;
  }

  // check existing order.
  if (checkoutState?.checkout?.id) {
    return checkoutState?.checkout?.id;
  }

  // we don't have and order id.
  return null;
};

/** Parse the path with expansions. */
export const parsePath = (id, endpoint = '') => {
  let path = id ? `${baseUrl}${id}` : baseUrl;
  path = `${path}${endpoint}`;
  return addQueryArgs(path, {
    expand,
  });
};

/** Fethc a checkout by id */
export const fetchCheckout = async ({ id, query = {} }) => {
  return (await apiFetch({
    path: addQueryArgs(parsePath(id), withDefaultQuery(query)),
  })) as Checkout;
};

/** Create or update the checkout. */
export const createOrUpdateCheckout = async ({ id = null, data = {}, query = {} }) => {
  id = !id ? findInitialCheckoutId() : id;
  return await apiFetch({
    method: id ? 'PATCH' : 'POST', // create or update
    path: addQueryArgs(parsePath(id), withDefaultQuery(query)),
    data: withDefaultData(data),
  });
};

/** Create the checkout */
export const createCheckout = async ({ data = {}, query = {} }) => {
  return await apiFetch({
    method: 'POST', // create
    path: addQueryArgs(parsePath(null), withDefaultQuery(query)),
    data: withDefaultData(data),
  });
};

/** Update the checkout. */
export const updateCheckout = async ({ id, data = {}, query = {} }) => {
  return await apiFetch({
    method: 'PATCH',
    path: addQueryArgs(parsePath(id), withDefaultQuery(query)),
    data: withDefaultData(data),
  });
};

/** Finalize a checkout */
export const finalizeCheckout = async ({ id, data = {}, query = {}, processor }: { id: string; data?: any; query?: any; processor: { id: string; manual: boolean } }) => {
  return (await apiFetch({
    method: 'POST',
    path: addQueryArgs(
      parsePath(id, '/finalize'),
      withDefaultQuery({
        ...(processor?.manual ? { manual_payment: true, manual_payment_method_id: processor?.id } : { processor_type: processor?.id }),
        ...query,
      }),
    ),
    data: withDefaultData(data),
  })) as Checkout;
};

/**
 * Add a line item.
 */
export const addLineItem = async ({ checkout, data, live_mode = false }) => {
  const existingLineItem = (checkout?.line_items?.data || []).find(item => {
    if (!item?.variant?.id) {
      return item.price.id === data.price;
    }
    return item.variant.id === data.variant && item.price.id === data.price;
  });

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

  // handle existing line item.
  if (!!existingLineItem) {
    return await updateLineItem({ id: existingLineItem?.id, data: { ...data, quantity: existingLineItem?.quantity + data?.quantity } });
  }

  const item = (await apiFetch({
    path: addQueryArgs(`surecart/v1/line_items/${existingLineItem?.id ? existingLineItem?.id : ''}`, {
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

  return await fetchCheckout({ id: checkoutId });
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

export const toggleSwap = async ({ id, action = 'swap' }) => {
  const item = (await apiFetch({
    path: addQueryArgs(`surecart/v1/line_items/${id}/${action}`, {
      expand: [
        ...(expand || []).map(item => {
          return item.includes('.') ? item : `checkout.${item}`;
        }),
        'checkout',
      ],
    }),
    method: 'PATCH',
  })) as LineItem;

  return item?.checkout as Checkout;
};
