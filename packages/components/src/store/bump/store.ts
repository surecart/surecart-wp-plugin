import { createStore } from '@stencil/store';
import { Bump, Product } from 'src/types';

interface Store {
  bump: Bump | null;
  product: Product | null;
  busy: boolean;
  disabled: boolean;
}

const product = window?.scData?.product_data?.product || null;
const bump = window?.scData?.bump_data?.bump || null;

const store = createStore<Store>(
  {
    bump,
    product,
    busy: false,
    disabled: false,
  },
  (newValue, oldValue) => {
    return JSON.stringify(newValue) !== JSON.stringify(oldValue);
  },
);

const { state, onChange, on, dispose, forceUpdate } = store;
export default state;
export { state, onChange, on, dispose, forceUpdate };

if (window?.sc?.store) {
  window.sc.store.bump = store;
}
