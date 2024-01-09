/**
 * Internal dependencies.
 */
import { on } from '../product';
import { isUpsellExpired } from './getters';
import { update, handleDeclined, handleAccepted } from './mutations';
import state, { onChange } from './store';

/**
 * When line itme changes, update totals.
 */
on('set', (_, newValue, oldValue) => {
  if (JSON.stringify(newValue?.line_item) !== JSON.stringify(oldValue?.line_item)) {
    update();
  }
});

/**
 * Watch for upsell to expire.
 */
setInterval(() => {
  maybeRedirectUpsell();
}, 1000);
export const maybeRedirectUpsell = () => {
  if (isUpsellExpired()) {
    state.loading = 'complete';
  }
};

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
    handleAccepted();
  }
  if (val === 'declined') {
    handleDeclined();
  }
});
