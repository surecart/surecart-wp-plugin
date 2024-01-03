import { createStore } from '@stencil/store';
import { Checkout, Product, Upsell } from 'src/types';

interface Store {
  upsell: Upsell | null;
  product: Product | null;
  busy: boolean;
  disabled: boolean;
  checkout: Checkout | null;
}

const product = window?.scData?.product_data?.product || null;
const upsell = window?.scData?.upsell_data?.upsell || null;
const checkout = window?.scData?.upsell_data?.checkout || null;

const store = createStore<Store>(
  {
    upsell : upsell,
    product,
    busy: false,
    disabled: false,
    checkout: checkout,
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
