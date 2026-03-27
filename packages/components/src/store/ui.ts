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

export const toggleCart = (open = null) => {
  if (!open) {
    return;
  }
  const event = new CustomEvent('scToggleCart', {
    bubbles: true,
  });
  document.dispatchEvent(event);
};

const { on } = store;
on('set', (key, newState) => {
  if (key !== 'cart') return; // we only care about cart.

  if (newState?.open) {
    speak(__('Cart Opened', 'surecart'), 'assertive');
  } else {
    speak(__('Cart Closed', 'surecart'), 'assertive');
  }
});

window.sc = {
  ...(window?.sc || {}),
  cart: {
    ...(window?.sc?.cart || {}),
    toggle: toggleCart,
  },
};

export { on };
export default store;
