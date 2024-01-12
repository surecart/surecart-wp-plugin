import { createLocalStore } from '../local';
import { createStore } from '@stencil/store';
import { getSerializedState } from '@store/utils';
import { getQueryArg } from '@wordpress/url';
const { checkout } = getSerializedState();

const notPersistCart = checkout?.persist !== 'browser' || !!getQueryArg(window.location.href, 'no_cart');

const store = notPersistCart
  ? createStore<{ live: any; test: any }>({
      live: {},
      test: {},
    })
  : createLocalStore<{ live: any; test: any }>(
      'surecart-local-storage',
      {
        live: {},
        test: {},
      },
      true,
    );

const { state, onChange, on, set, get, dispose } = store;
window.scStore = store;
export default store;
export { state, onChange, on, set, get, dispose };
