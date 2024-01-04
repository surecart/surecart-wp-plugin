/**
 * External dependencies.
 */
import { getSerializedState } from '@store/utils';
import { createStore } from '@stencil/store';

/**
 * Internal dependencies.
 */
import { Checkout, Product, Upsell } from 'src/types';

const { upsell } = getSerializedState();

interface Store {
  upsell: Upsell | null;
  product: Product | null;
  checkout_id: string | null;
  busy: boolean;
  disabled: boolean;
  checkout: Checkout | null;
  success_url: string | null;
}

const store = createStore<Store>(
  {
    upsell: null,
    product: null,
    checkout_id: null,
    busy: false,
    disabled: false,
    checkout: null,
    success_url: null,
    ...upsell,
  },
  (newValue, oldValue) => {
    return JSON.stringify(newValue) !== JSON.stringify(oldValue);
  },
);

const { state, onChange, on, dispose, forceUpdate } = store;
export default state;
export { state, onChange, on, dispose, forceUpdate };
