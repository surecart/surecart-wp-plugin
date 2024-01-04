/**
 * External dependencies.
 */
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies.
 */
import { state } from './store';
import { state as checkoutState } from '../checkout/store';

export const redirectUpsell = () => {
  // Get current upsell.
  const { upsell, checkout_id } = state;

  const { recommended_upsells } = checkoutState.checkout;

  // Get the next upsell by priority from recommended upsells.
  const nextUpsell = (recommended_upsells?.data || []).find(item => {
    return item.priority > upsell.priority;
  });

  // Redirect to next upsell permalink with checkout_id and form_id.
  if (!!nextUpsell?.permalink) {
    window.location.assign(
      addQueryArgs(nextUpsell.permalink, {
        sc_checkout_id: checkout_id,
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
