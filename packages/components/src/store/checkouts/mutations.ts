import { Checkout } from 'src/types';
import store from './store';
import { state as checkoutState } from '@store/checkout';
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
  if (window?.scData?.do_not_persist_cart && data?.id) {
    window.history.replaceState({}, document.title, addQueryArgs(window.location.href, { checkout_id: data?.id }));
  }
};

/** Clear the order from the store. */
export const clearCheckout = (formId: number | string, mode: 'live' | 'test') => {
  const { [formId]: remove, ...checkouts } = store.state[mode];
  window.history.replaceState({}, document.title, removeQueryArgs(window.location.href, 'redirect_status', 'coupon', 'line_items', 'confirm_checkout_id', 'checkout_id'));
  return store.set(mode, checkouts);
};
