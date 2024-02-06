/**
 * External dependencies.
 */
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies.
 */
import { Checkout, LineItem, Price } from 'src/types';
import { state } from './store';
import { state as productState } from '../product';
import { createErrorNotice, removeNotice } from '@store/notices/mutations';
import { getExitUrl, getUpsell } from './getters';

/**
 * Handle accepted
 */
export const handleAccepted = () => {
  const upsell = getUpsell('accepted');
  // TODO: Analytics
  if (!upsell?.permalink) {
    return (state.loading = 'complete');
  }
  state.loading = 'redirecting';
  window.location.assign(
    addQueryArgs(upsell?.permalink, {
      sc_checkout_id: state.checkout?.id,
      sc_form_id: state.form_id,
    }),
  );
};

/**
 * Handle declined.
 */
export const handleDeclined = () => {
  const upsell = getUpsell('declined');
  // TODO: Analytics
  if (!upsell?.permalink) {
    return (state.loading = 'complete');
  }
  state.loading = 'redirecting';
  window.location.assign(
    addQueryArgs(upsell?.permalink, {
      sc_checkout_id: state.checkout?.id,
      sc_form_id: state.form_id,
    }),
  );
};

/**
 * Redirect to next link.
 */
export const handleComplete = () => {
  const nextLink = getExitUrl();
  if (!nextLink) {
    return (state.loading = 'complete');
  }
  state.loading = 'redirecting';
  window.location.assign(nextLink);
};

/**
 * Cancel the upsell.
 */
export const cancel = () => (state.loading = 'declined');

/**
 * Purchase the upsell
 */
export const purchase = () => update({ preview: false });

/**
 * Update the upsell.
 */
export const update = async ({ preview } = { preview: true }) => {
  try {
    if (!state.checkout_id || state.busy) {
      return;
    }

    state.loading = 'busy';
    removeNotice();

    // Add Upsell to line item.
    const { checkout, ...lineItem } = (await apiFetch({
      path: addQueryArgs('surecart/v1/line_items/upsell', {
        preview,
        expand: ['checkout', 'checkout.upsell_funnel', 'upsell_funnel.upsells', 'fees', 'upsell.price'],
      }),
      method: 'POST',
      data: {
        ...productState[state.product?.id]?.line_item,
        price_id: (state.upsell?.price as Price)?.id,
        upsell: state.upsell?.id,
        checkout: state.checkout_id,
      },
    })) as LineItem;

    state.checkout = checkout as Checkout;
    state.line_item = lineItem as LineItem;

    if (preview === true) {
      return (state.loading = 'idle');
    }

    state.loading = 'accepted';
  } catch (error) {
    if (error?.additional_errors?.[0]?.code === 'line_item.upsell.already_applied') {
      return (state.loading = 'accepted');
    }
    state.loading = 'idle';
    createErrorNotice(error);
  }
};
