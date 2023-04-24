import state, { onChange, on } from './store';
import { getCheckout, setCheckout } from '../checkouts';

/**
 * When the checkout changes, update the
 * checkout in localstorage.
 */
onChange('checkout', val => setCheckout(val, state.formId));

on('get', prop => {
  if (prop === 'checkout') {
    const checkout = getCheckout(state.formId, state.mode);
    if (checkout?.id) {
      state.checkout = checkout;
    }
  }
});
