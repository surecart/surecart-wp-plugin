/**
 * Internal dependencies.
 */
import { addQueryArgs } from '@wordpress/url';
import { on } from '../product';
import { getExitUrl, isUpsellExpired } from './getters';
import { preview } from './mutations';
import state, { onChange } from './store';

/**
 * When line item changes, update totals.
 */
on('set', (_, newValue, oldValue) => {
  if (JSON.stringify(newValue?.line_item) !== JSON.stringify(oldValue?.line_item)) {
    preview();
  }
});

/**
 * Watch for upsell to expire every second.
 */
setInterval(() => {
  if (isUpsellExpired()) {
    state.loading = 'complete';
  }
}, 1000);

/**
 * Dynamically update amount_due when line_item changes.
 */
onChange('line_item', () => {
  state.amount_due = state?.line_item?.total_amount + (state?.line_item?.trial_amount ?? 0);
});

/**
 * When the upsell changes, complete or redirect.
 */
onChange('upsell', val => {
  // completed.
  if (!val?.permalink) {
    return (state.loading = 'complete');
  }

  // redirect to next upsell.
  state.loading = 'redirecting';
  window.location.assign(
    addQueryArgs(val?.permalink, {
      sc_checkout_id: state.checkout?.id,
      sc_form_id: state.form_id,
    }),
  );
});

/**
 * When the loading state changes, redirect if complete.
 */
onChange('loading', val => {
  if (val === 'complete') {
    const nextLink = getExitUrl();
    if (!nextLink) {
      return (state.loading = 'complete');
    }
    state.loading = 'redirecting';
    window.location.assign(nextLink);
  }
});
