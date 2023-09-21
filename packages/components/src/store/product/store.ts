import { createStore } from '@stencil/store';
import { LineItemData } from 'src/types';
import { Price, Product, VariantOption, Variant } from 'src/types';
import { productViewed } from './events';

interface Store {
  formId: number;
  mode: 'live' | 'test';
  product: Product;
  prices: Price[];
  variants: Variant[];
  variant_options: VariantOption[];
  quantity: number;
  selectedPrice: Price;
  total: number;
  busy: boolean;
  disabled: boolean;
  checkoutUrl: string;
  adHocAmount: number;
  dialog: string;
  line_item: LineItemData;
  error: string;
  selectedVariant?: Variant;
  variantValues: { [key: string]: string };
}
const product = window?.scData?.product_data?.product || null;
const prices = product?.prices?.data || [];
const variant_options = product?.variant_options?.data || [];
const variants = product?.variants?.data || [];
const selectedPrice = (prices || []).sort((a, b) => a?.position - b?.position).find(price => !price?.archived);

const adHocAmount = selectedPrice?.amount || null;

if (product) {
  productViewed(product);
}

const store = createStore<Store>(
  {
    formId: window?.scData?.product_data?.form?.ID,
    mode: window?.scData?.product_data?.mode || 'live',
    product,
    prices,
    variant_options,
    variants,
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
      variant: variants?.length ? variants[0]?.id : null,
    },
    selectedVariant: variants?.length ? variants[0] : null,
    variantValues: {},
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
