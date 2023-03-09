import { createStore } from '@stencil/store';

export default createStore<any>(
  () => ({
    cart: {
      open: false,
      count: 0,
    },
  }),
  (newValue, oldValue) => {
    return JSON.stringify(newValue) !== JSON.stringify(oldValue);
  },
);
