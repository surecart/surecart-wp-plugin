import { ProductState } from 'src/types';
import state, { on } from './store';

on('set', (productId: string, newValue: ProductState, oldValue: ProductState) => {
  if (JSON.stringify(newValue?.selectedPrice) !== JSON.stringify(oldValue?.selectedPrice)) {
    updateSelectedPrice(productId, newValue);
  }

  const shouldUpdateLineItem = ['selectedPrice', 'adHocAmount', 'quantity'].some(key => JSON.stringify(newValue[key]) !== JSON.stringify(oldValue[key]));

  if (shouldUpdateLineItem) {
    setLineItem(productId);
  }
});

const updateSelectedPrice = (productId: string, newValue: ProductState) => {
  // update the total when the selected price changes.
  state[productId].total = state[productId].adHocAmount || newValue?.selectedPrice?.amount || 0;
  // set the ad hoc amount to the selected product amount.
  state[productId].adHocAmount = newValue?.selectedPrice?.amount;
  // update disabled based on if price is archived or product is archived.
  state[productId].disabled = newValue?.selectedPrice?.archived || state[productId].product?.archived;
};

const setLineItem = (productId: string) => {
  state[productId].line_item = {
    price_id: state[productId].selectedPrice?.id,
    quantity: state[productId].selectedPrice?.ad_hoc ? 1 : state[productId].quantity,
    ...(state[productId].selectedPrice?.ad_hoc ? { ad_hoc_amount: state[productId].adHocAmount } : {}),
  };
};
