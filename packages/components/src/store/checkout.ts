import { createStore } from '@stencil/store';
import { getCheckout, setOrder } from './checkouts';

const { state, onChange, on } = createStore<any>(
  () => ({
    formId: null,
    mode: 'live',
    checkout: {},
  }),
  (newValue, oldValue) => {
    return JSON.stringify(newValue) !== JSON.stringify(oldValue);
  },
);

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
export { onChange };
