import { getValidAdHocAmount } from './getters';
import { updateLineItem } from './mutations';
import state, { on, set } from './store';
import { onChange } from '../checkout/store';
import { isInRange } from '../../functions/util';
import { getLineItemByProductId } from '@store/checkout/getters';

// when the checkout changes, update the selected price and ad hoc amount
onChange('checkout', () => {
  Object.keys(state).forEach(productId => {
    const lineItem = getLineItemByProductId(productId);
    if (lineItem) {
      set(productId, {
        ...state[productId],
        selectedPrice: lineItem.price,
        ad_hoc_amount: lineItem.ad_hoc_amount,
        custom_amount: (state[productId].amounts || []).includes(lineItem.ad_hoc_amount) ? null : lineItem.ad_hoc_amount,
      });
    }
  });
});

// for each product
Object.keys(state).forEach(productId => {
  // when the product is updated
  on('set', (prop, val, prev) => {
    // if the product is the one we're looking for
    if (prop !== productId) return;
    // and the selectedPrice has changed
    if (val?.selectedPrice?.id !== prev?.selectedPrice?.id || val?.ad_hoc_amount !== prev?.ad_hoc_amount || val?.custom_amount !== prev?.custom_amount) {
      // use custom amount if it's in range, otherwise use the first valid amount
      const ad_hoc_amount = val?.custom_amount && isInRange(val?.custom_amount, val.selectedPrice) ? val?.custom_amount : getValidAdHocAmount(productId);
      // update the line item
      updateLineItem(productId, {
        price: val.selectedPrice?.id || val.product?.prices?.data[0]?.id,
        quantity: 1, // quantity should always be 1.
        ad_hoc_amount,
      });
    }
  });
});
