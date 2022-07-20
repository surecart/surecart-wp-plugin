import { createStore } from '@stencil/store';

export default createStore<any>(
  () => ({
    cart: {
      open: false,
    },
  }),
  (newValue, oldValue) => {
    return JSON.stringify(newValue) !== JSON.stringify(oldValue);
  },
);
