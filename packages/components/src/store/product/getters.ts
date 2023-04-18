import state from './store';
/**
 * Available product prices
 * @returns {Price[]} - Returns an array of prices that are not archived
 */
export const availablePrices = () => (state.prices || []).filter(price => !price?.archived);
