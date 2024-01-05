import { state } from './store';

export const getDiscountedAmount = amount => {
  return state?.line_item?.total_amount || amount;
};

export const getScratchAmount = amount => {
  return state?.line_item?.scratch_amount || amount;
};

/**
 * Get upsell remaining time.
 */
export const getUpsellRemainingTime = (timeFormat = 'seconds') => {
  // Get upsell expiration timestamp from checkout.
  const expiresAt = state.checkout?.upsells_expire_at; // in seconds

  // If no expiration timestamp, return 0.
  if (!expiresAt) return 0;

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

  // If no remaining time, return true.
  if (!remaining || remaining < 0) return true;

  // Otherwise, return false.
  return false;
};
