import { addLineItem } from '../../services/session';
import state from './store';
import { getCheckout, setCheckout } from '@store/checkouts';
import { Checkout } from 'src/types';
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
    doCartGoogleAnalytics({
      currency: state.selectedPrice.currency,
      value: state.selectedPrice.amount,
      items: [{
        item_id: state.product.id,
        discount: checkout.discount.id,
        item_name: state.product.name,
        price: state.selectedPrice.amount,
        quantity: state.selectedPrice.ad_hoc ? 1 : state.quantity,
      }],
    });
    toggleCart(true);
    state.dialog = null;
  } catch (e) {
    console.error(e);
    state.error = e;
  } finally {
    state.busy = false;
  }
};
