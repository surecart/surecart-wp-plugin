import { createLocalStore } from './local';
const store = createLocalStore<any>('surecart-local-storage', () => ({}), true);
export default store;

/** Get the order. */
export const getOrder = (formId: number | string) => {
  return store?.state?.checkouts?.[formId];
};

/** Set the order. */
export const setOrder = (data: object, formId: number) => {
  store.set('checkouts', { ...store.state.checkouts, [formId]: data });
};

/** Update the order in the store. */
export const updateOrder = (data: object, formId: number) => {
  return store.set('checkouts', {
    ...store.state.checkouts,
    [formId]: {
      ...(store?.state?.checkouts?.[formId] || {}),
      ...data,
    },
  });
};

/** Clear the order from the store. */
export const clearOrder = (formId: number | string) => {
  const { [formId]: remove, ...checkouts } = store.state.checkouts;
  return store.set('checkouts', checkouts);
};
