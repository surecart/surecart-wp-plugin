import { createStore } from '@stencil/store';
import { Price, Product } from 'src/types';

interface Store {
  formId: number;
  mode: 'live' | 'test';
  product: Product;
  prices: Price[];
  quantity: number;
  selectedPrice: Price;
  total: number;
  checkoutUrl: string;
  adHocAmount: number;
  error: string;
}

const { state, onChange, on, dispose } = createStore<Store>(
  {
    formId: null,
    mode: 'live',
    product: null,
    prices: [],
    quantity: 1,
    selectedPrice: null,
    total: null,
    adHocAmount: null,
    error: null,
    checkoutUrl: null,
  },
  (newValue, oldValue) => {
    return JSON.stringify(newValue) !== JSON.stringify(oldValue);
  },
);

export default state;
export { state, onChange, on, dispose };
