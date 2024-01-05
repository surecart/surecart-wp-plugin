import { state } from './store';

export const getDiscountedAmount = amount => {
  if (state.upsell?.amount_off) {
    return Math.max(0, amount - state.upsell?.amount_off);
  }

  if (state.upsell?.percent_off) {
    const off = amount * (state.upsell?.percent_off / 100);
    return Math.max(0, amount - off);
  }

  return amount;
};

export const getUpsellRemainingTime = ( timeFormat = 'seconds' ) => {
  // Get upsell expiration timestamp from checkout.
  const expiresAt = state.checkout?.upsells_expire_at;

  // If no expiration timestamp, return 0.
  if (!expiresAt) return 0;

  // Get current timestamp.
  const now = Date.now();

  // Get remaining time in seconds.
  const remaining = Math.floor((expiresAt - now) / 1000);

  // Check time format - seconds, minues, hours.
  if (timeFormat === 'seconds') return remaining;
  if (timeFormat === 'minutes') return Math.floor(remaining / 60);
  if (timeFormat === 'hours') return Math.floor(remaining / 60 / 60);
};

export const isUpsellExpired = () => {
  // Get remaining time in seconds.
  const remaining = getUpsellRemainingTime();

  // If no remaining time, return true.
  if (!remaining || remaining < 0) return true;

  // Otherwise, return false.
  return false;
}
