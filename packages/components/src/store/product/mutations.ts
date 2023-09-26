import { addLineItem } from '../../services/session';
import state from './store';
import { getCheckout, setCheckout } from '@store/checkouts';
import { Checkout, Product } from 'src/types';
import { toggleCart } from '@store/ui';
import { doCartGoogleAnalytics } from '../../functions/google-analytics-cart';
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

export const getProductBuyLink = (productId: string, url: string) => {
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
    no_cart: true,
  });
};
