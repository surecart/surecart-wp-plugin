import { addLineItem } from '../../services/session';
import state from './store';
import { getCheckout, setCheckout } from '@store/checkouts';
import { Checkout, Product, ProductState } from 'src/types';
import { toggleCart } from '@store/ui';
import { doCartGoogleAnalytics } from '../../functions/google-analytics-cart';
import { addQueryArgs } from '@wordpress/url';
import { setProduct } from './setters';
import apiFetch from '../../functions/fetch';

export const submitCartForm = async (productId: string) => {
  if (!state[productId]) {
    await addProductToState(productId, {});
  }

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
        quantity: productState.selectedPrice?.ad_hoc ? 1 : productState.quantity,
        ...(productState.selectedPrice?.ad_hoc ? { ad_hoc_amount: productState.adHocAmount } : {}),
      },
      live_mode: productState.mode !== 'test',
    });
    setCheckout(checkout as Checkout, productState.formId);
    const newLineItem = checkout.line_items?.data.find(item => item.price.id === productState.selectedPrice?.id);
    if (newLineItem) {
      doCartGoogleAnalytics([
        {
          item_id: (newLineItem.price?.product as Product)?.id,
          item_name: (newLineItem.price?.product as Product)?.name,
          item_variant: newLineItem.price?.name,
          price: newLineItem.price?.amount,
          currency: newLineItem.price?.currency,
          quantity: newLineItem.quantity,
          discount: newLineItem.discount_amount,
        },
      ]);
    }
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
        quantity: productState.selectedPrice?.ad_hoc ? 1 : productState.quantity,
        ...(productState.selectedPrice?.ad_hoc ? { ad_hoc_amount: productState.adHocAmount } : {}),
      },
    ],
    ...query,
  });
};

export const addProductToState = async (productId: string, productState: Partial<ProductState>) => {
  if (!productId) return;

  state[productId] = {
    busy: true,
  } as ProductState;

  const productDetails = (await apiFetch({
    path: addQueryArgs(`surecart/v1/products/${productId}`, {
      expand: ['image', 'prices'],
    }),
  })) as Product;

  if (!productDetails) {
    state[productId] = null;
    return;
  }

  const prices = productDetails?.prices?.data || [];
  const selectedPrice = productState.selectedPrice || (prices || []).sort((a, b) => a?.position - b?.position).find(price => !price?.archived);
  const adHocAmount = selectedPrice?.amount || null;

  state[productId] = {
    formId: window?.scData?.product_data?.form?.ID,
    mode: window?.scData?.product_data?.mode || 'live',
    product: productDetails,
    prices,
    quantity: productState?.quantity || 1,
    selectedPrice,
    total: null,
    dialog: productState?.dialog || null,
    busy: false,
    disabled: selectedPrice?.archived || productDetails?.archived,
    adHocAmount,
    error: null,
    checkoutUrl: window?.scData?.product_data?.checkout_link,
    line_item: {
      price_id: selectedPrice?.id,
      quantity: productState?.quantity || 1,
      ...(selectedPrice?.ad_hoc ? { ad_hoc_amount: adHocAmount } : {}),
    },
  };
};
