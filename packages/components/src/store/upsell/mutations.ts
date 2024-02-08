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

/**
 * Purchase the upsell
 */
export const accept = () => update({ preview: false });

/**
 * Decline the upsell.
 */
export const decline = async () => {
  try {
    if (!state.checkout_id || state.loading !== 'idle') {
      return;
    }
    // Add Upsell to line item.
    const { checkout, ...lineItem } = (await apiFetch({
      path: addQueryArgs(`surecart/v1/checkouts/${state.checkout_id}/decline_upsell`, {
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
  } catch (error) {
    state.loading = 'idle';
    createErrorNotice(error);
  }
};

/**
 * Update the upsell.
 */
export const preview = async ({ preview } = { preview: true }) => {
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
