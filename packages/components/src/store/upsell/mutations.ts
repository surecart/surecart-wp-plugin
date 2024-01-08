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
import { createErrorNotice } from '@store/notices/mutations';
import { hasNextLink, getNextLink } from './getters';

/**
 * Maybe redirect to next upsell.
 */
export const redirect = () => {
  const nextLink = getNextLink();
  if (!nextLink) {
    return null;
  }
  state.loading = 'redirecting';
  window.location.assign(nextLink);
};

/**
 * Cancel the upsell.
 */
export const cancel = () => (state.loading = hasNextLink() ? 'redirecting' : 'complete');

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

    // Add Upsell to line item.
    const { checkout, ...lineItem } = (await apiFetch({
      path: addQueryArgs('surecart/v1/line_items/upsell', {
        preview,
        expand: ['checkout', 'checkout.recommended_upsells', 'fees', 'upsell.price'],
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

    state.loading = hasNextLink() ? 'redirecting' : 'complete';
  } catch (error) {
    if (error?.additional_errors?.[0]?.code === 'line_item.upsell.already_applied') {
      return (state.loading = hasNextLink() ? 'redirecting' : 'complete');
    }
    state.loading = 'idle';
    createErrorNotice(error);
  }
};
