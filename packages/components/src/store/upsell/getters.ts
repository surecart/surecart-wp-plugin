import { Price } from 'src/types';
import { state } from './store';
import { addQueryArgs } from '@wordpress/url';

/**
 * Is it busy
 */
export const isBusy = () => ['loading', 'busy', 'redirecting'].includes(state.loading);

/**
 * Get the next upsell.
 */
export const getNextUpsell = () =>
  (state?.checkout?.recommended_upsells?.data || [])
    .sort((a, b) => a?.priority - b?.priority) // sort by priority.
    .filter(u => (u.price as Price)?.ad_hoc === false) // filter out ad_hoc
    .find(item => item.priority > state.upsell.priority); // get the first upsell with priority greater than current upsell.

/**
 * Get the next link.
 */
export const getNextLink = () => {
  const nextUpsell = getNextUpsell();
  if (nextUpsell?.permalink) {
    return addQueryArgs(nextUpsell.permalink, {
      sc_checkout_id: state?.checkout?.id,
      sc_form_id: state.form_id,
    });
  }
  return state?.checkout?.metadata?.success_url || state.success_url || null;
};

/**
 * Check if there is a next link.
 */
export const hasNextLink = () => !!getNextLink();

/**
 * Get the discounted amount.
 */
export const getDiscountedAmount = amount => {
  return state?.line_item?.total_amount ?? amount;
};

/**
 * Get the scratch amount.
 */
export const getScratchAmount = amount => {
  if (!state?.line_item?.total_savings_amount) {
    return amount;
  }
  return -state?.line_item?.total_savings_amount + state?.line_item?.total_amount;
};

/**
 * Get upsell remaining time.
 */
export const getUpsellRemainingTime = (timeFormat = 'seconds') => {
  // Get upsell expiration timestamp from checkout.
  const expiresAt = state.checkout?.upsells_expire_at; // in seconds

  // If no expiration timestamp, return 0.
  if (!expiresAt) return null;

  // Get current timestamp.
  const now = Date.now();

  // Get remaining time in seconds.
  const remaining = Math.floor((expiresAt * 1000 - now) / 1000);

  // If remaining time is less than 0, return 0.
  if (remaining < 0) return 0;

  // Check time format - seconds, minues, hours.
  if (timeFormat === 'seconds') return remaining;
  if (timeFormat === 'minutes') return Math.floor(remaining / 60);
  if (timeFormat === 'hours') return Math.floor(remaining / 60 / 60);
};

/**
 * Format time unit - add a zero if unit is less than 10.
 */
export const formatTimeUnit = unit => (unit < 10 ? `0${unit}` : `${unit}`);

/**
 * Get formatted remaining time.
 */
export const getFormattedRemainingTime = () => {
  // not loaded.
  if (!state.checkout?.upsells_expire_at) return '--:--';

  const time = getUpsellRemainingTime('seconds');

  const days = Math.floor(time / (60 * 60 * 24));
  const hours = Math.floor((time % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((time % (60 * 60)) / 60);
  const seconds = Math.floor(time % 60);

  if (days > 0) {
    return `${formatTimeUnit(days)}:${formatTimeUnit(hours)}:${formatTimeUnit(minutes)}:${formatTimeUnit(seconds)}`;
  }
  if (hours > 0) {
    return `${formatTimeUnit(hours)}:${formatTimeUnit(minutes)}:${formatTimeUnit(seconds)}`;
  }
  return `${formatTimeUnit(minutes)}:${formatTimeUnit(seconds)}`;
};

/**
 * Is upsell expired.
 */
export const isUpsellExpired = () => {
  // Get remaining time in seconds.
  const remaining = getUpsellRemainingTime();

  // Make sure we wait until it's set.
  if (remaining === null) {
    return false;
  }

  return remaining <= 0;
};
