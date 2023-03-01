import { createStore } from '@stencil/store';
import { Checkout, Product } from '../../types';

interface Store {
  formId: number | string;
  mode: 'live' | 'test';
  locks: string[];
  product: Product;
  checkout: Checkout;
}

const { state, onChange, on, set, get, dispose } = createStore<Store>(
  {
    formId: null,
    mode: 'live',
    locks: [],
    product: null,
    checkout: null,
  },
  (newValue, oldValue) => {
    return JSON.stringify(newValue) !== JSON.stringify(oldValue);
  },
);

export default state;
export { state, onChange, on, set, get, dispose };
