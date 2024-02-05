/**
 * Internal dependencies.
 */
import { on } from '../product';
import { isUpsellExpired } from './getters';
import { update, handleDeclined, handleAccepted, handleComplete } from './mutations';
import state, { onChange } from './store';

/**
 * When line item changes, update totals.
 */
on('set', (_, newValue, oldValue) => {
  if (JSON.stringify(newValue?.line_item) !== JSON.stringify(oldValue?.line_item)) {
    update();
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
 * When loading is complete, redirect.
 */
onChange('loading', val => {
  if (val === 'accepted') {
    return handleAccepted();
  }
  if (val === 'declined') {
    return handleDeclined();
  }
  if (val === 'complete') {
    return handleComplete();
  }
});
