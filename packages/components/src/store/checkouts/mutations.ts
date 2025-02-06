import { Checkout } from 'src/types';
import store from './store';
import { state as checkoutState, reset as resetCheckoutState } from '@store/checkout';
import { addQueryArgs, removeQueryArgs } from '@wordpress/url';

/** Get the checkout. */
export const getCheckout = (formId: number | string, mode: 'live' | 'test') => store.state[mode]?.[formId] || {};

/** Set the checkout. */
export const setCheckout = (data: Checkout, formId: number | string) => {
  const mode = data?.live_mode ? 'live' : 'test';
  store.set(mode, { ...store.state[mode], [formId]: data });
  // update the current checkout state.
  if (checkoutState.formId === formId && checkoutState.mode === mode) {
    checkoutState.checkout = data;
  }
  // set in url only if we are not persisting the cart.
  if (checkoutState.persist === 'url' && data?.id) {
    window.history.replaceState({}, document.title, addQueryArgs(window.location.href, { checkout_id: data?.id }));
  }

  const event = new CustomEvent('scCheckoutUpdated', {
    detail: {
      checkout: checkoutState.checkout,
      formId: checkoutState.formId,
      mode: checkoutState.mode,
    },
    bubbles: true,
  });
  document.dispatchEvent(event);
};

/** Clear the order from the store. */
export const clearCheckout = (formId: number | string, mode: 'live' | 'test', checkoutId: string = '') => {
  const { [formId]: remove, ...checkouts } = store.state[mode];
  window.history.replaceState({}, document.title, removeQueryArgs(window.location.href, 'redirect_status', 'coupon', 'line_items', 'confirm_checkout_id', 'checkout_id'));
  store.set(mode, checkouts);

  // manually clear out any cart that has this checkout, just in case the store for this form is
  // not set to persist.
  const localCheckouts = JSON.parse(localStorage.getItem('surecart-local-storage') || '{}');
  if (localCheckouts[mode]?.[formId]) {
    if (checkoutId && localCheckouts[mode]?.[formId]?.id !== checkoutId) {
      return;
    }
    delete localCheckouts[mode][formId];
    localStorage.setItem('surecart-local-storage', JSON.stringify(localCheckouts));
  }

  resetCheckoutState();
};
