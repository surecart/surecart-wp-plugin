/**
 * Internal dependencies.
 */
import { on } from '../product';
import { createOrUpdateUpsell } from './mutations';

on('set', (_, newValue, oldValue) => {
  // when line itme changes, update totals.
  if (JSON.stringify(newValue?.line_item) !== JSON.stringify(oldValue?.line_item)) {
    createOrUpdateUpsell();
  }
});
