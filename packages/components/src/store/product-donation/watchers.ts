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

    // line item is updated, update the store
    if (lineItem) {
      return set(productId, {
        ...state[productId],
        selectedPrice: lineItem.price,
        ad_hoc_amount: lineItem.ad_hoc_amount,
        custom_amount: (state[productId].amounts || []).includes(lineItem.ad_hoc_amount) ? null : lineItem.ad_hoc_amount,
      });
    }

    // line item is deleted, reset the store
    set(productId, {
      ...state[productId],
      selectedPrice: null,
      ad_hoc_amount: null,
      custom_amount: null,
    });
  });
});

// for each product
Object.keys(state).forEach(productId => {
  // when the product is updated
  on('set', (prop, val, prev) => {
    // if the product is the one we're looking for
    if (prop !== productId) return;
    // It's been cleared.
    if (!val?.selectedPrice && !val?.ad_hoc_amount && !val?.custom_amount) return;
    // and the selectedPrice has changed
    if (val?.selectedPrice?.id !== prev?.selectedPrice?.id || val?.ad_hoc_amount !== prev?.ad_hoc_amount || val?.custom_amount !== prev?.custom_amount) {
      // use custom amount if it's in range, otherwise use the first valid amount
      const ad_hoc_amount = val?.custom_amount && isInRange(val?.custom_amount, val.selectedPrice) ? val?.custom_amount : getValidAdHocAmount(productId);
      const price = val.selectedPrice?.id || val.product?.prices?.data.find(price => price?.ad_hoc)?.id;
      // if there's no price, return
      if (!price) return;
      // update the line item
      updateLineItem(productId, {
        price,
        quantity: 1, // quantity should always be 1.
        ad_hoc_amount,
      });
    }
  });
});
