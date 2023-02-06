import { createStore } from '@stencil/store';

export const store = createStore<any>(
  () => ({
    formId: null,
    mode: 'live',
    product: {},
    prices: [],
    quantity: 1,
    selectedPrice: null,
    total: null,
    adHocAmount: null,
    error: null,
  }),
  (newValue, oldValue) => {
    return JSON.stringify(newValue) !== JSON.stringify(oldValue);
  },
);

const { state, onChange } = store;

onChange('selectedPrice', value => {
  state.total = state.adHocAmount || value?.amount || 0;
});

// update a specific object property in the store.
export const update = (key, data) => store.set(key, { ...store?.[key], ...data });

window.surecart = window.surecart || {};
window.surecart.product = {
  store,
  state,
  update,
};

export default state;
