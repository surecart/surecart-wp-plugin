import { createStore } from '@stencil/store';
import { speak } from '@wordpress/a11y';
import { __ } from '@wordpress/i18n';

export const store = createStore<any>(
  () => ({
    cart: {
      open: false,
    },
  }),
  (newValue, oldValue) => {
    return JSON.stringify(newValue) !== JSON.stringify(oldValue);
  },
);

const { state } = store;

export const toggleCart = (open = null) => store.set('cart', { ...state.cart, ...{ open: open !== null ? open : !state.cart.open } });

const { on } = store;
on('set', (key, newState) => {
  if (key !== 'cart') return; // we only care about cart.

  if (newState?.open) {
    speak(__('Cart Opened', 'surecart'), 'assertive');
  } else {
    speak(__('Cart Closed', 'surecart'), 'assertive');
  }
});
export default store;
