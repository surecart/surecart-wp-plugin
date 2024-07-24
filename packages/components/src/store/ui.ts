import { createStore } from '@stencil/store';
import { speak } from '@wordpress/a11y';
import { __ } from '@wordpress/i18n';
import { state as checkoutState } from '@store/checkout';
import { getCheckout } from '@store/checkouts/mutations';

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
  const checkout = getCheckout(checkoutState.formId, checkoutState.mode);

  const event = new CustomEvent('sCheckoutUpdatedOnProductPage', {
    // This is for the product page which is created using shortcodes.
    detail: { checkout, formId: checkoutState.formId, mode: checkoutState.mode },
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
