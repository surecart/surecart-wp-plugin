import { Checkout } from '../types';
import { createLocalStore } from './local';
import { createStore } from '@stencil/store';
import { state as checkoutState } from '@store/checkout';
import { addQueryArgs } from '@wordpress/url';

const store = window?.scData?.do_not_persist_cart
  ? createStore<{ live: any; test: any }>({
      live: {},
      test: {},
    })
  : createLocalStore<{ live: any; test: any }>(
      'surecart-local-storage',
      {
        live: {},
        test: {},
      },
      true,
    );

window.scStore = store;
export default store;

/** Get the checkout. */
export const getOrder = (formId: number | string, mode: 'live' | 'test') => store.state[mode]?.[formId] || {};
export const getCheckout = getOrder;

/** Set the checkout. */
export const setOrder = (data: Checkout, formId: number | string) => {
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
export const setCheckout = setOrder;

/** Clear the order from the store. */
export const clearOrder = (formId: number | string, mode: 'live' | 'test') => {
  const { [formId]: remove, ...checkouts } = store.state[mode];
  return store.set(mode, checkouts);
};
export const clearCheckout = clearOrder;
