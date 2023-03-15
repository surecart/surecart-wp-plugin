import { state as checkoutState } from '@store/checkout';
import { state as processorsState } from '@store/processors';
import { addQueryArgs, getQueryArg } from '@wordpress/url';

import apiFetch from '../../functions/fetch';
import { Checkout } from '../../types';

/** The base url for this service. */
export const baseUrl = 'surecart/v1/checkouts/';

/** Items to always expand. */
export const expand = [
  'line_items',
  'line_item.price',
  'line_item.fees',
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
  'manual_payment_method',
];

/** Default data we send with every request. */
export const withDefaultData = (data: { metadata?: any } = {}) => ({
  currency: checkoutState?.checkout?.currency || checkoutState?.currencyCode,
  live_mode: checkoutState.mode !== 'test',
  group_key: checkoutState.groupId,
  abandoned_checkout_return_url: checkoutState.abandonedCheckoutReturnUrl,
  abandoned_checkout_enabled: checkoutState.abandonedCheckoutEnabled,
  metadata: {
    ...(data?.metadata || {}),
    ...(window?.scData?.page_id && { page_id: window?.scData?.page_id }),
    ...(checkoutState?.product?.id && { buy_page_product_id: checkoutState?.product?.id }),
    page_url: window.location.href,
  },
  ...data,
});

/** Default query we send with every request. */
export const withDefaultQuery = (query = {}) => ({
  ...(!!checkoutState?.formId && { form_id: checkoutState?.formId }),
  ...(!!checkoutState?.product?.id && { product_id: checkoutState?.product?.id }),
  ...(!!processorsState.config.stripe.paymentElement && { stage_processor_type: 'stripe' }),
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
