import { Checkout } from '../types';
import { createLocalStore } from './local';
import { createStore } from '@stencil/store';

// we will store payment intents in memory only.
let payment_intents = {};
let store;

if (window?.scData?.do_not_persist_cart) {
  store = createStore({
    live: {},
    test: {},
  });
} else {
  store = createLocalStore<any>(
    'surecart-local-storage',
    () => ({
      live: {},
      test: {},
    }),
    true,
  );
}

window.scStore = store;
export default store;

/** Get the order. */
export const getOrder = (formId: number | string, mode: 'live' | 'test') => {
  return {
    ...(store.state[mode]?.[formId] || {}),
    staged_payment_intents: payment_intents || {},
  };
};

/** Set the order. */
export const setOrder = (data: Checkout, formId: number | string) => {
  const mode = data?.live_mode ? 'live' : 'test';
  const { staged_payment_intents, ...checkout } = data;
  payment_intents = staged_payment_intents;
  store.set(mode, { ...store.state[mode], [formId]: checkout });
};

/** Update the order in the store. */
export const updateOrder = (data: object, formId: number | string, mode: 'live' | 'test') => {
  return store.set(mode, {
    ...store.state[mode],
    [formId]: {
      ...(store.state[mode]?.[formId] || {}),
      ...data,
    },
  });
};

/** Clear the order from the store. */
export const clearOrder = (formId: number | string, mode: 'live' | 'test') => {
  const { [formId]: remove, ...checkouts } = store.state[mode];
  return store.set(mode, checkouts);
};
