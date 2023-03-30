import { Product } from 'src/types';
import { getCheckout } from '../checkouts';
import state from './store';

/**
 * Gets the current checkout for the page.
 */
export const currentCheckout = () => getCheckout(state.formId, state.mode);

/**
 * Is the checkout currently locked.
 * Pass an optional lock name to find if a
 * specific lock name is locking checkout.
 */
export const checkoutIsLocked = (lockName = ''): boolean => (lockName ? state.locks.some(name => name === lockName) : !!state.locks?.length);

/**
 * Get a line item by product id.
 */
export const getLineItemByProductId = (productId: string) => (state.checkout?.line_items?.data || []).find(line_item => (line_item?.price?.product as Product)?.id === productId);
