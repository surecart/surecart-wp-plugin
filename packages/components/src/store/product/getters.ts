import { Price, ProductState } from 'src/types';
import state from './store';
/**
 * Available product prices
 *
 * @param {string} productId - Product ID
 *
 * @returns {Price[]} - Returns an array of prices that are not archived
 */
export const availablePrices = (productId: string): Price[] => (state[productId]?.prices || []).filter(price => !price?.archived).sort((a, b) => a?.position - b?.position); // sort by position

/**
 * Get Product
 *
 * @param {string} productId - Product ID
 *
 * @returns {ProductState} - Returns the product state
 */
export const getProduct = (productId?: string): ProductState => {
  if (!productId) return null;

  return state[productId];
};
