/**
 * External dependencies.
 */
import { getSerializedState } from '@store/utils';
import { createStore } from '@stencil/store';

/**
 * Internal dependencies.
 */
import { Checkout, LineItem, Product, Upsell } from 'src/types';

/**
 * Get upsell from serialized state.
 */
const { upsell } = getSerializedState();

interface Store {
  upsell: Upsell;
  product: Product;
  line_item: LineItem;
  amount_due: number;
  checkout_id: string;
  checkout: Checkout;
  form_id: number;
  busy: boolean;
  disabled: boolean;
  success_url: string;
  loading: 'loading' | 'busy' | 'idle' | 'complete' | 'redirecting';
  text: {
    success: {
      title: string;
      description: string;
      button: string;
    };
  };
}

const store = createStore<Store>(
  {
    upsell: null,
    product: null,
    line_item: null,
    checkout_id: null,
    checkout: null,
    form_id: null,
    busy: false,
    disabled: false,
    success_url: null,
    text: {
      success: {
        title: '',
        description: '',
        button: '',
      },
    },
    ...upsell,
  },
  (newValue, oldValue) => {
    return JSON.stringify(newValue) !== JSON.stringify(oldValue);
  },
);

const { state, onChange, on, dispose, forceUpdate } = store;
export default state;
export { state, onChange, on, dispose, forceUpdate };
