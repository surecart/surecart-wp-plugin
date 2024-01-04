/**
 * External dependencies.
 */
// import { getQueryArg } from '@wordpress/url';
import { createStore } from '@stencil/store';

/**
 * Internal dependencies.
 */
import { Checkout, Product, Upsell } from 'src/types';

interface Store {
  upsell: Upsell | null;
  product: Product | null;
  checkout_id: string | null;
  busy: boolean;
  disabled: boolean;
  checkout: Checkout | null;
  success_url: string | null;
}

// TODO: Remove this if sc_initial_state works.
// const product = window?.scData?.product_data?.product || null;
// const upsell = window?.scData?.upsell_data?.upsell || null;
// const checkout_id = (getQueryArg(window.location.href, 'sc_checkout_id') as string) || null;

const store = createStore<Store>(
  {
    upsell: null,
    product : null,
    checkout_id : null,
    busy: false,
    disabled: false,
    checkout: null,
    success_url: null,
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
