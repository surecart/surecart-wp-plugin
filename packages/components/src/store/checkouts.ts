import { Checkout } from '../types';
import { createLocalStore } from './local';

const store = createLocalStore<any>(
  'surecart-local-storage',
  () => ({
    live: {},
    test: {},
  }),
  true,
);
export default store;

/** Get the order. */
export const getOrder = (formId: number | string, mode: 'live' | 'test') => {
  return store.state[mode]?.[formId];
};

/** Set the order. */
export const setOrder = (data: Checkout, formId: number | string) => {
  const mode = data?.live_mode ? 'live' : 'test';
  store.set(mode, { ...store.state[mode], [formId]: data });
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
