import state from './store';
/**
 * Available product prices
 * @returns {Price[]} - Returns an array of prices that are not archived
 */
export const availablePrices = () => (state.prices || []).filter(price => !price?.archived).sort((a, b) => a?.position - b?.position); // sort by position

export const availableSubscriptionPrices = () => (availablePrices() || []).filter(price => price?.recurring_interval).sort((a, b) => a?.position - b?.position);

export const availableNonSubscriptionPrices = () => (availablePrices() || []).filter(price => !price?.recurring_interval).sort((a, b) => a?.position - b?.position);

