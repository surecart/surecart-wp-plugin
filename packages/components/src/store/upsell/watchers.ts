/**
 * Internal dependencies.
 */
import { on } from '../product';
import { createOrUpdateUpsell } from './mutations';
import state, { onChange } from './store';

on('set', (_, newValue, oldValue) => {
  // when line itme changes, update totals.
  if (JSON.stringify(newValue?.line_item) !== JSON.stringify(oldValue?.line_item)) {
    createOrUpdateUpsell();
  }
});

// dynamically update amount_due when line_item changes.
onChange('line_item', () => {
  state.amount_due = state?.line_item?.total_amount + (state?.line_item?.trial_amount ?? 0);
});
