import { createLocalStore } from '../local';
import { createStore } from '@stencil/store';
import { getQueryArg } from '@wordpress/url';

const notPersistCart = !!window?.scData?.do_not_persist_cart || !!getQueryArg(window.location.href, 'no_cart');

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
