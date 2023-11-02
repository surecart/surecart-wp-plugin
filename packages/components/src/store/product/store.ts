import { createStore } from '@stencil/store';
import { ProductState } from 'src/types';

interface Store {
  [key: string]: ProductState;
}
const product = window?.scData?.product_data?.product || null;
const prices = product?.prices?.data || [];
const selectedPrice = (prices || []).sort((a, b) => a?.position - b?.position).find(price => !price?.archived);
const adHocAmount = selectedPrice?.amount || null;

const defaultState: Store = {};

if (!!product?.id) {
  defaultState[product.id] = {
    formId: window?.scData?.product_data?.form?.ID,
    mode: window?.scData?.product_data?.mode || 'live',
    product,
    prices,
    quantity: 1,
    selectedPrice,
    total: null,
    dialog: null,
    busy: false,
    disabled: selectedPrice?.archived || product?.archived,
    adHocAmount,
    error: null,
    checkoutUrl: window?.scData?.product_data?.checkout_link,
    line_item: {
      price_id: selectedPrice?.id,
      quantity: 1,
      ...(selectedPrice?.ad_hoc ? { ad_hoc_amount: adHocAmount } : {}),
    },
  };
}

const store = createStore<Store>(defaultState, (newValue, oldValue) => {
  return JSON.stringify(newValue) !== JSON.stringify(oldValue);
});

const { state, onChange, on, dispose, forceUpdate } = store;
export default state;
export { state, onChange, on, dispose, forceUpdate };

if (window?.sc?.store) {
  window.sc.store.product = store; // need to deprecate this
  window.sc.store.products = store;
}
