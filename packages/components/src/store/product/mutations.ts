import { addLineItem } from '../../services/session';
import state from './store';
import { getCheckout, setCheckout } from '@store/checkouts';
import { Checkout, Product } from 'src/types';
import { toggleCart } from '@store/ui';
import { doCartGoogleAnalytics } from '../../functions/google-analytics-cart';

export const submitCartForm = async () => {
  if (!state.selectedPrice?.id) return;
  if (state.selectedPrice?.ad_hoc && !state.adHocAmount) return;
  try {
    state.busy = true;
    const checkout = await addLineItem({
      checkout: getCheckout(state?.formId, state.mode),
      data: {
        price: state.selectedPrice?.id,
        ...(state.selectedPrice?.ad_hoc ? { ad_hoc_amount: state.adHocAmount } : {}),
        quantity: state.selectedPrice?.ad_hoc ? 1 : state.quantity,
      },
      live_mode: state.mode !== 'test',
    });
    setCheckout(checkout as Checkout, state.formId);
    const newLineItem = checkout.line_items?.data.find((item) => item.price.id === state.selectedPrice?.id);
    if (newLineItem) {
      doCartGoogleAnalytics([{
        item_id: newLineItem.price?.product_id,
        item_name: (newLineItem.price?.product as Product)?.name,
        item_variant: newLineItem.price?.name,
        price: newLineItem.price?.amount,
        currency: newLineItem.price?.currency,
        quantity: newLineItem.quantity,
        discount: newLineItem.discount_amount
      }]);
    }
    toggleCart(true);
    state.dialog = null;
  } catch (e) {
    console.error(e);
    state.error = e;
  } finally {
    state.busy = false;
  }
};
