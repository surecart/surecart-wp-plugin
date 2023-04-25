import { createStore } from '@stencil/store';
import { Price, Product } from 'src/types';

interface Store {
  formId: number;
  mode: 'live' | 'test';
  product: Product;
  prices: Price[];
  quantity: number;
  selectedPrice: Price;
  total: number;
  checkoutUrl: string;
  adHocAmount: number;
  error: string;
}
const product = window?.scData?.product_data?.product || null;
const prices = product?.prices?.data || [];
const selectedPrice = (prices || []).find(price => !price?.archived);

const { state, onChange, on, dispose } = createStore<Store>(
  {
    formId: window?.scData?.product_data?.form?.ID,
    mode: window?.scData?.product_data?.mode || 'live',
    product,
    prices,
    quantity: 1,
    selectedPrice,
    total: null,
    adHocAmount: null,
    error: null,
    checkoutUrl: window?.scData?.product_data?.checkout_link,
  },
  (newValue, oldValue) => {
    return JSON.stringify(newValue) !== JSON.stringify(oldValue);
  },
);

export default state;
export { state, onChange, on, dispose };
