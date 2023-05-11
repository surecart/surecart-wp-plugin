import { createStore } from '@stencil/store';
import { LineItemData } from 'src/types';
import { Price, Product } from 'src/types';

interface Store {
  formId: number;
  mode: 'live' | 'test';
  product: Product;
  prices: Price[];
  quantity: number;
  selectedPrice: Price;
  total: number;
  busy: boolean;
  checkoutUrl: string;
  adHocAmount: number;
  dialog: string;
  line_item: LineItemData;
  error: string;
}
const product = window?.scData?.product_data?.product || null;
const prices = product?.prices?.data || [];
const selectedPrice = (prices || []).find(price => !price?.archived);
const adHocAmount = selectedPrice?.amount || null;

const store = createStore<Store>(
  {
    formId: window?.scData?.product_data?.form?.ID,
    mode: window?.scData?.product_data?.mode || 'live',
    product,
    prices,
    quantity: 1,
    selectedPrice,
    total: null,
    dialog: null,
    busy: false,
    adHocAmount,
    error: null,
    checkoutUrl: window?.scData?.product_data?.checkout_link,
    line_item: {
      price_id: selectedPrice?.id,
      quantity: 1,
      ...(selectedPrice?.ad_hoc ? { ad_hoc_amount: adHocAmount } : {}),
    },
  },
  (newValue, oldValue) => {
    return JSON.stringify(newValue) !== JSON.stringify(oldValue);
  },
);

const { state, onChange, on, dispose, forceUpdate } = store;
export default state;
export { state, onChange, on, dispose, forceUpdate };

if (window?.sc?.store) {
  window.sc.store.product = store;
}
