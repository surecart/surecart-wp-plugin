import { addLineItem } from '../../services/session';
import state from './store';
import { getCheckout, setCheckout } from '@store/checkouts/mutations';
import { Checkout } from 'src/types';
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
