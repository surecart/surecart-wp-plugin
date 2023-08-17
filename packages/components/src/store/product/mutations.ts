import { addLineItem } from '../../services/session';
import state from './store';
import { getCheckout, setCheckout } from '@store/checkouts';
import { Checkout } from 'src/types';
import { toggleCart } from '@store/ui';

export const submitCartForm = async () => {
  if (!state.selectedPrice?.id) return;
  if (state.selectedPrice?.ad_hoc && ( null === state.adHocAmount || undefined === state.adHocAmount )) return;
  try {
    state.busy = true;
    const checkout = await addLineItem({
      checkout: getCheckout(state?.formId, state.mode),
      data: {
        price: state.selectedPrice?.id,
        ...(state.selectedPrice?.ad_hoc ? { ad_hoc_amount: state.adHocAmount } : {}),
        quantity: state.selectedPrice?.ad_hoc ? 1 : state.quantity,
        variant: state.selectedVariant?.id
      },
      live_mode: state.mode !== 'test',
    });
    setCheckout(checkout as Checkout, state.formId);
    toggleCart(true);
    state.dialog = null;
  } catch (e) {
    console.error(e);
    state.error = e;
  } finally {
    state.busy = false;
  }
};
