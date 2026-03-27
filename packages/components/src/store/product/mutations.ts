import state from './store';
import { toggleCart } from '@store/ui';
import { addQueryArgs } from '@wordpress/url';
import { setProduct } from './setters';
import { addCheckoutLineItem } from '@store/checkout/mutations';

export const submitCartForm = async (productId: string) => {
  const productState = state[productId];
  if (!productState) return;
  if (!productState.selectedPrice?.id) return;
  if (productState.selectedPrice?.ad_hoc && (null === productState.adHocAmount || undefined === productState.adHocAmount)) return;

  try {
    setProduct(productId, { busy: true });
    await addCheckoutLineItem({
      price: productState.selectedPrice?.id,
      quantity: Math.max(productState.selectedPrice?.ad_hoc ? 1 : productState.quantity, 1),
      ...(productState.selectedPrice?.ad_hoc ? { ad_hoc_amount: productState.adHocAmount } : {}),
      variant: productState.selectedVariant?.id,
      ...(productState.note ? { note: productState.note } : {}),
    });
    toggleCart(true);
    setProduct(productId, { dialog: null });
  } catch (e) {
    console.error(e);
    state.error = e;
    throw e; // Re-throw the caught error
  } finally {
    setProduct(productId, { busy: false });
  }
};

/**
 * Get the product buy link.
 */
export const getProductBuyLink = (productId: string, url: string, query = {}) => {
  const productState = state[productId];

  if (!productState) return;
  if (!productState.selectedPrice?.id) return;
  if (productState.selectedPrice?.ad_hoc && !productState.adHocAmount && 0 !== productState.adHocAmount) return;

  return addQueryArgs(url, {
    line_items: [
      {
        price: productState.selectedPrice?.id,
        quantity: Math.max(productState.selectedPrice?.ad_hoc ? 1 : productState.quantity, 1),
        ...(productState.selectedPrice?.ad_hoc ? { ad_hoc_amount: productState.adHocAmount } : {}),
        ...(productState.selectedVariant?.id ? { variant: productState.selectedVariant?.id } : {}),
        ...(productState.note ? { note: productState.note } : {}),
      },
    ],
    ...query,
  });
};
