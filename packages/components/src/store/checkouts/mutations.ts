import { Checkout } from 'src/types';
import store from './store';
import { state as checkoutState } from '@store/checkout';
import { addQueryArgs, removeQueryArgs } from '@wordpress/url';
import { getSerializedState } from '@store/utils';
const { checkout } = getSerializedState();

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
};

/** Clear the order from the store. */
export const clearCheckout = (formId: number | string, mode: 'live' | 'test') => {
  const { [formId]: remove, ...checkouts } = store.state[mode];
  window.history.replaceState({}, document.title, removeQueryArgs(window.location.href, 'redirect_status', 'coupon', 'line_items', 'confirm_checkout_id', 'checkout_id'));
  store.set(mode, checkouts);

  // set the current state to default if we are clearing the current checkout.
  const defaultState = {
    formId: null,
    groupId: null,
    mode: 'live',
    locks: [],
    product: null,
    checkout: null,
    currencyCode: 'usd',
    abandonedCheckoutEnabled: true,
    initialLineItems: [],
    isCheckoutPage: false,
    validateStock: false,
    persist: 'browser',
    ...checkout,
  };

  for (const key in defaultState) {
    checkoutState[key] = defaultState[key];
  }
};
