import { createStore } from '@stencil/store';
import { getCheckout, setOrder } from '../checkouts';

const { state, onChange, on } = createStore<any>(
  () => ({
    formId: null,
    mode: 'live',
    locks: [],
    checkout: {},
  }),
  (newValue, oldValue) => {
    return JSON.stringify(newValue) !== JSON.stringify(oldValue);
  },
);

/**
 * Checkout locking.
 */
export const lockCheckout = lockName => (state.locks = [...state.locks, lockName]);
export const unLockCheckout = lockName => (state.locks = state.locks.filter(name => name !== lockName));
export const checkoutIsLocked = (lockName = '') => (lockName ? state.locks.some(name => name === lockName) : state.locks?.length);

export const listenTo = (prop, propKey, callback) =>
  on('set', (key, newValue, oldValue) => {
    if (key !== prop) return;

    // handle an array, if one has changed, run callback.
    if (Array.isArray(propKey)) {
      if (propKey.some(key => JSON.stringify(newValue?.[key]) !== JSON.stringify(oldValue?.[key]))) {
        return callback(newValue, oldValue);
      }
    }

    if (JSON.stringify(newValue?.[propKey]) === JSON.stringify(oldValue?.[propKey])) return;
    return callback(newValue?.[propKey], oldValue?.[propKey]);
  });

// get the checkout from the checkouts store based on formId and mode.
on('get', prop => {
  if (prop === 'checkout') {
    state.checkout = getCheckout(state.formId, state.mode);
  }
});

// handle setting the checkout.
on('set', (prop, value) => {
  if (prop === 'checkout') {
    setOrder(value, state.formId);
  }
});

export default state;
export { state, onChange, on };
