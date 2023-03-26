import { createStore } from '@stencil/store';
import { Checkout, Product } from '../../types';

interface Store {
  product: Product;
  mode: 'live' | 'test';
  locks: string[];
  checkout: Checkout;
}

const { state, onChange, on, set, get, dispose } = createStore<Store>(
  {
    product: null,
    mode: 'live',
    locks: [],
    checkout: null,
  },
  (newValue, oldValue) => {
    return JSON.stringify(newValue) !== JSON.stringify(oldValue);
  },
);

export default state;
export { state, onChange, on, set, get, dispose };
