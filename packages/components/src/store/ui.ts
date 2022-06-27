import { createStore } from '@stencil/store';

export default createStore<any>(() => ({
  ui: {
    cart: {
      open: false,
    },
  },
}));
