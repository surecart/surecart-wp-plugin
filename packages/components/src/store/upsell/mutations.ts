/**
 * External dependencies.
 */
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies.
 */
import { Checkout, LineItem } from 'src/types';
import { state } from './store';
import { state as productState } from '../product';
import { createErrorNotice } from '@store/notices/mutations';

// Get the next upsell by priority from recommended upsells.
export const getNextUpsell = () => (state?.checkout?.recommended_upsells?.data || []).find(item => item.priority > state.upsell.priority);

// Redirect
export const redirectUpsell = () => {
  const nextUpsell = getNextUpsell();

  // we don't have an upsell.
  if (!nextUpsell?.permalink) {
    // checkout metadata has success_url, redirect to success_url.
    if (!!state?.checkout?.metadata?.success_url) {
      return window.location.assign(state.checkout.metadata?.success_url);
    }
    if (state.success_url) {
      return window.location.assign(state.success_url);
    }

    // TODO: update state to complete to show popup.
  }

  // Redirect to next upsell permalink with checkout_id and form_id.
  window.location.assign(
    addQueryArgs(nextUpsell.permalink, {
      sc_checkout_id: state?.checkout?.id,
      sc_form_id: state.form_id,
    }),
  );
};

// create or update upsell.
export const createOrUpdateUpsell = async ({ preview } = { preview: true }) => {
  try {
    if (!state.checkout_id || state.busy) {
      return;
    }

    state.busy = true;

    // Add Upsell to line item.
    const { checkout, ...lineItem } = (await apiFetch({
      path: addQueryArgs('surecart/v1/line_items/upsell', {
        preview,
        expand: ['checkout', 'checkout.recommended_upsells'],
      }),
      method: 'POST',
      data: {
        line_item: {
          ...productState[state.product?.id]?.line_item,
          upsell: state.upsell?.id,
          checkout: state.checkout_id,
        },
      },
    })) as LineItem;

    state.checkout = checkout as Checkout;
    state.line_item = lineItem as LineItem;

    // we have paid, handle the redirect.
    if (preview === false) {
      redirectUpsell();
    }
  } catch (error) {
    console.error(error);
    createErrorNotice(error);
  } finally {
    state.busy = false;
  }
};
