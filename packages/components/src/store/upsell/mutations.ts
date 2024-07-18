/**
 * External dependencies.
 */
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../functions/fetch';

/**
 * Internal dependencies.
 */
import { Checkout, LineItem, Price } from 'src/types';
import { state } from './store';
import { state as productState } from '../product';
import { createErrorNotice, removeNotice } from '@store/notices/mutations';
import { __ } from '@wordpress/i18n';

/**
 * Update the upsell.
 */
export const trackOffer = () =>
  apiFetch({
    path: `surecart/v1/checkouts/${state.checkout_id}/offer_upsell/${state.upsell?.id}`,
    method: 'POST',
    keepalive: true, // Important: allow the request to outlive the page.
  });

/**
 * Update the upsell.
 */
export const preview = async () => {
  try {
    if (!state.checkout_id || state.loading === 'busy') {
      return;
    }

    state.loading = 'busy';
    removeNotice();

    // Add Upsell to line item.
    const { checkout, ...lineItem } = await upsellRequest({ preview: true });

    state.checkout = checkout as Checkout;
    state.line_item = lineItem as LineItem;
  } catch (error) {
    console.error(error);

    if ((error?.additional_errors || []).find(error => error?.data?.options?.purchasable_statuses?.includes('out_of_stock'))) {
      return createErrorNotice({ code: 'out_of_stock', message: __('Apologies, this is currently out of stock.', 'surecart') });
    }

    if ((error?.additional_errors || []).find(error => error?.code === 'line_item.upsell.expired')) {
      state.loading = 'idle';
      createErrorNotice({ code: 'expired', message: __('This offer has expired.', 'surecart') });
      return decline();
    }

    createErrorNotice(error);
  } finally {
    state.loading = 'idle';
  }
};

export const accept = async () => {
  try {
    if (!state.checkout_id || state.loading === 'busy') {
      return;
    }

    state.loading = 'busy';
    removeNotice();

    // Add Upsell to line item.
    const { checkout } = await upsellRequest({ preview: false });

    handleCompletion(checkout);
  } catch (error) {
    state.loading = 'idle';
    createErrorNotice(error);
  }
};

/**
 * Decline the upsell.
 */
export const decline = async () => {
  try {
    if (!state.checkout_id || state.loading === 'busy') {
      return;
    }

    state.loading = 'busy';
    removeNotice();

    // Add Upsell to line item.
    const checkout = (await apiFetch({
      path: addQueryArgs(`surecart/v1/checkouts/${state.checkout_id}/decline_upsell/${state.upsell?.id}`, {
        expand: ['checkout', 'checkout.current_upsell', 'fees'],
      }),
      method: 'POST',
      data: {
        ...productState[state.product?.id]?.line_item,
        price_id: (state.upsell?.price as Price)?.id,
        upsell: state.upsell?.id,
        checkout: state.checkout_id,
      },
    })) as Checkout;

    handleCompletion(checkout);
  } catch (error) {
    state.loading = 'idle';
    createErrorNotice(error);
  }
};

/**
 * Make the request to the upsell endpoing
 */
export const upsellRequest = args =>
  apiFetch({
    path: addQueryArgs('surecart/v1/line_items/upsell', {
      ...args,
      expand: ['checkout', 'checkout.current_upsell', 'checkout.manual_payment_method', 'fees', 'line_item', 'line_item.price'],
    }),
    method: 'POST',
    data: {
      ...productState[state.product?.id]?.line_item,
      price_id: (state.upsell?.price as Price)?.id,
      upsell: state.upsell?.id,
      checkout: state.checkout_id,
    },
  }) as Promise<LineItem>;

/**
 * Handle what to do on completion.
 */
export const handleCompletion = checkout => {
  // There is no more upsells, or the link is the same.
  if (!checkout.current_upsell?.permalink || checkout?.current_upsell?.permalink === state.upsell?.permalink) {
    return (state.loading = 'complete');
  }

  // redirect to next upsell.
  state.loading = 'redirecting';
  window.location.assign(
    addQueryArgs(checkout.current_upsell?.permalink, {
      sc_checkout_id: state.checkout?.id,
      sc_form_id: state.form_id,
    }),
  );
};
