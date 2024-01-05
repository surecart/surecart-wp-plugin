/**
 * External dependencies.
 */
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies.
 */
import { Price } from 'src/types';
import { state } from './store';
import { state as checkoutState } from '../checkout/store';
import { state as productState } from '../product';
import { createErrorNotice } from '@store/notices/mutations';

export const getNextUpsell = () => {
  // Get current upsell.
  const { upsell } = state;
  const { recommended_upsells } = checkoutState.checkout;

  // Get the next upsell by priority from recommended upsells.
  return (recommended_upsells?.data || []).find(item => {
    return item.priority > upsell.priority;
  });
};

export const redirectUpsell = () => {
  const nextUpsell = getNextUpsell();

  // Redirect to next upsell permalink with checkout_id and form_id.
  if (!!nextUpsell?.permalink) {
    window.location.assign(
      addQueryArgs(nextUpsell.permalink, {
        sc_checkout_id: checkoutState?.checkout?.id,
        sc_form_id: checkoutState.formId,
      }),
    );
  }

  // If no next upsell, and has success_url, redirect to success_url.
  if (!nextUpsell?.permalink && !!checkoutState.checkout.metadata?.success_url) {
    window.location.assign(checkoutState.checkout.metadata?.success_url);
  }

  // If no next upsell, and has no success_url, show popup.
  if (!nextUpsell?.permalink && !checkoutState.checkout.metadata?.success_url) {
    // checkoutState.showPopup = true;
  }
};

export const createOrUpdateUpsell = async () => {
  try {
    state.disabled = true;
    const priceId = (state.upsell.price as Price)?.id || (state.upsell?.price as string);

    // Add Upsell to line item.
    (await apiFetch({
      path: addQueryArgs(`surecart/v1/line_items/upsell`),
      method: 'POST',
      data: {
        line_item: {
          upsell: state.upsell?.id,
          price: priceId,
          quantity: productState[state.product?.id]?.quantity || 1,
          checkout: state.checkout_id,
        },
      },
    })) as any;
  } catch (error) {
    console.error(error);
    createErrorNotice(error);
  } finally {
    state.disabled = false;
  }
};
