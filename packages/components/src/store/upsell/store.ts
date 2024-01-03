import { createStore } from '@stencil/store';
import { Product, Upsell } from 'src/types';

interface Store {
  upsell: Upsell | null;
  product: Product | null;
  busy: boolean;
  disabled: boolean;
}

const product = window?.scData?.product_data?.product || null;
const upsell = window?.scData?.upsell_data?.upsell || null;

const store = createStore<Store>(
  {
    upsell : upsell,
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
  window.sc.store.upsell = store;
}
