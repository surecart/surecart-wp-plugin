import state, { on } from './store';
import { getCheckout, setOrder } from '../checkouts';
import { Checkout } from '../../types';

// get the checkout from the checkouts store based on formId and mode.
on('get', (prop: string) => {
  if (prop === 'checkout') {
    state.checkout = getCheckout(state.formId, state.mode);
  }
});

// handle setting the checkout.
on('set', (prop: string, checkout: Checkout) => {
  if (prop === 'checkout') {
    setOrder(checkout, state.formId);
  }
});
