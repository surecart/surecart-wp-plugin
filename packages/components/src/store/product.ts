import { createStore } from '@stencil/store';

export default createStore<any>(
  () => ({
    product: {},
  }),
  (newValue, oldValue) => {
    return JSON.stringify(newValue) !== JSON.stringify(oldValue);
  },
);
