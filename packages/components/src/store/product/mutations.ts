import { addLineItem } from '../../services/session';
import state from './store';
import { getCheckout, setCheckout } from '@store/checkouts/mutations';
import { Checkout, Product } from 'src/types';
import { toggleCart } from '@store/ui';
import { addQueryArgs } from '@wordpress/url';
import { setProduct } from './setters';

export const submitCartForm = async (productId: string) => {
  const productState = state[productId];
  if (!productState) return;
  if (!productState.selectedPrice?.id) return;
  if (productState.selectedPrice?.ad_hoc && (null === productState.adHocAmount || undefined === productState.adHocAmount)) return;

  try {
    setProduct(productId, { busy: true });
    const checkout = await addLineItem({
      checkout: getCheckout(productState?.formId, productState.mode),
      data: {
        price: productState.selectedPrice?.id,
        quantity: Math.max(productState.selectedPrice?.ad_hoc ? 1 : productState.quantity, 1),
        ...(productState.selectedPrice?.ad_hoc ? { ad_hoc_amount: productState.adHocAmount } : {}),
        variant: productState.selectedVariant?.id,
      },
      live_mode: productState.mode !== 'test',
    });
    setCheckout(checkout as Checkout, productState.formId);
    toggleCart(true);
    setProduct(productId, { dialog: null });
  } catch (e) {
    console.error(e);
    state.error = e;
  } finally {
    setProduct(productId, { busy: false });
  }
};

export const getProductBuyLink = (productId: string, url: string, query = {}) => {
  const productState = state[productId];

  if (!productState) return;
  if (!productState.selectedPrice?.id) return;
  if (productState.selectedPrice?.ad_hoc && !productState.adHocAmount) return;

  return addQueryArgs(url, {
    line_items: [
      {
        price: productState.selectedPrice?.id,
        quantity: Math.max(productState.selectedPrice?.ad_hoc ? 1 : productState.quantity, 1),
        ...(productState.selectedPrice?.ad_hoc ? { ad_hoc_amount: productState.adHocAmount } : {}),
        ...(productState.selectedVariant?.id ? { variant: productState.selectedVariant?.id } : {}),

      },
    ],
    ...query,
  });
};

export const addProductToState = (product: Product, formId: number, mode: 'live' | 'test', checkoutLink: string) => {
  if (!product?.id) return;

  const prices = product?.prices?.data || [];
  const selectedPrice = (prices || []).sort((a, b) => a?.position - b?.position).find(price => !price?.archived);
  const adHocAmount = selectedPrice?.amount || null;
  const variant_options = product?.variant_options?.data || [];
const variants = (product?.variants?.data || []).sort((a, b) => a?.position - b?.position);
  const selectedVariant = variants?.length
  ? variants.find(variant => {
      if (!product?.stock_enabled || product?.allow_out_of_stock_purchases) return true;
      return variant?.available_stock > 0;
    })
  : null;

  state[product.id] = {
    formId: formId,
    mode: mode || 'live',
    product: product,
    prices,
    quantity: 1,
    selectedPrice,
    total: null,
    dialog: null,
    busy: false,
    disabled: selectedPrice?.archived,
    adHocAmount,
    error: null,
    checkoutUrl: checkoutLink,
    line_item: {
      price_id: selectedPrice?.id,
      quantity: 1,
      ...(selectedPrice?.ad_hoc ? { ad_hoc_amount: adHocAmount } : {}),
    },
    variant_options,
    variants,
    selectedVariant,
     variantValues: {
      ...(selectedVariant?.option_1 ? { option_1: selectedVariant?.option_1 } : {}),
      ...(selectedVariant?.option_2 ? { option_2: selectedVariant?.option_2 } : {}),
      ...(selectedVariant?.option_3 ? { option_3: selectedVariant?.option_3 } : {}),
    },
  };
};
