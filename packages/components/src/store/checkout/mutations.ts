import state from './store';
import { clearCheckout as clearSavedCheckout } from '../checkouts';

/**
 * Clear the current checkout.
 */
export const clearCheckout = () => clearSavedCheckout(state.formId, state.mode);

/**
 * Lock the checkout (disables input and submission)
 * Pass a lock name to prevent conflicts and allow multiple locks.
 */
export const lockCheckout = lockName => (state.locks = [...state.locks, lockName]);

/**
 * Unlock the checkout.
 * Pass an optional lock name to only unlock a specific lock
 */
export const unLockCheckout = (lockName = '') => (state.locks = !!lockName ? state.locks.filter(name => name !== lockName) : []);
