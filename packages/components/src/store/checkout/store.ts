import { createStore } from '@stencil/store';

import { Checkout, Product } from '../../types';

interface Store {
  formId: number | string;
  groupId: string;
  mode: 'live' | 'test';
  locks: string[];
  product: Product;
  checkout: Checkout;
  currencyCode: string;
}

const { state, onChange, on, set, get, dispose } = createStore<Store>(
  {
    formId: null,
    groupId: null,
    mode: 'live',
    locks: [],
    product: null,
    checkout: null,
    currencyCode: 'usd',
  },
  (newValue, oldValue) => {
    return JSON.stringify(newValue) !== JSON.stringify(oldValue);
  },
);

export default state;
export { state, onChange, on, set, get, dispose };
