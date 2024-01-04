/**
 * External dependencies.
 */
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies.
 */
import { state } from './store';
import { state as checkoutState } from '../checkout/store';

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
