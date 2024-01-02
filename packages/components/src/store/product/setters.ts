import { ProductState } from 'src/types';
import state from './store';

/**
 * Set the product
 *
 * @param {string} productId - Product ID
 * @param {Partial<ProductState>} product - Product object
 *
 * @returns {void}
 */
export const setProduct = (productId: string, product: Partial<ProductState>): void => {
  if (!productId) return;
  state[productId] = {
    ...state[productId],
    ...product,
  };
};
