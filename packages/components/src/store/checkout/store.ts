import { createStore } from '@stencil/store';
import { Checkout } from '../../types';

interface Store {
  formId: number;
  mode: 'live' | 'test';
  locks: string[];
  checkout: Checkout;
}

const { state, onChange, on, set, get, dispose } = createStore<Store>(
  {
    formId: null,
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
