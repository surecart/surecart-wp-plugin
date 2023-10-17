import { createStore } from '@stencil/store';
import { LineItemData } from 'src/types';
import { Price, Product, VariantOption, Variant } from 'src/types';

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
  variantValues: { option_1?: string; option_2?: string; option_3?: string };
}
const product = window?.scData?.product_data?.product || null;
const prices = product?.prices?.data || [];
const variant_options = product?.variant_options?.data || [];
const variants = product?.variants?.data || [];
const selectedPrice = (prices || []).sort((a, b) => a?.position - b?.position).find(price => !price?.archived);
const selectedVariant = variants?.length ? variants[0] : null;

const adHocAmount = selectedPrice?.amount || null;

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
    selectedVariant,
    variantValues: {
      ...(selectedVariant?.option_1 ? { option_1: selectedVariant?.option_1 } : {}),
      ...(selectedVariant?.option_2 ? { option_2: selectedVariant?.option_2 } : {}),
      ...(selectedVariant?.option_3 ? { option_3: selectedVariant?.option_3 } : {}),
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
