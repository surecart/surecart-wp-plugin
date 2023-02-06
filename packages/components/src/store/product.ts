import { createStore } from '@stencil/store';

export const store = createStore<any>(
  () => ({
    product: {},
    prices: [],
    quantity: 1,
    selectedPriceId: null,
  }),
  (newValue, oldValue) => {
    return JSON.stringify(newValue) !== JSON.stringify(oldValue);
  },
);

const { state } = store;

// update a specific object property in the store.
export const update = (key, data) => store.set(key, { ...store?.[key], ...data });

window.surecart = window.surecart || {};
window.surecart.product = {
  store,
  state,
  update,
};

export default state;
