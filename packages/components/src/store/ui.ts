import { createStore } from '@stencil/store';

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

const { state } = store;

export const toggleCart = (open = null) => store.set('cart', { ...state.cart, ...{ open: open !== null ? open : !state.cart.open } });
export default store;
