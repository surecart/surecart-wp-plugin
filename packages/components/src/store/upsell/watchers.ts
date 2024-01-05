/**
 * Internal dependencies.
 */
import { createOrUpdateCheckout } from '@services/session';
import { onChange as onChangeProduct, state as productState } from '../product';
import { createOrUpdateUpsell } from './mutations';
import state from './store';
import { Price } from 'src/types';

const maybeUpdateCheckoutLineItems = async () => {
  const productQty = productState?.[state.product?.id]?.quantity;

  // Update Upsell line items.
  await createOrUpdateUpsell();

  // Update Checkout line items.
  await createOrUpdateCheckout({
    id: state.checkout?.id,
    data: {
      line_items: [
        ...state.checkout?.line_items?.data,
        {
          price_id: (state.upsell?.price as Price).id || (state.upsell?.price as Price)?.id || state.upsell?.price,
          quantity: productQty || 1,
        },
      ],
    },
  });
};

onChangeProduct(state.product?.id, () => {
  maybeUpdateCheckoutLineItems();
});
