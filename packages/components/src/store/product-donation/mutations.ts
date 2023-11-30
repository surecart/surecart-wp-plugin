import { addCheckoutLineItem, updateCheckoutLineItem } from '@store/checkout/mutations';
import { getLineItemByProductId } from '@store/checkout/getters';
import { state } from './store';

export const updateDonationState = (productId, data) => {
  state[productId] = {
    ...state[productId],
    ...data,
  };
};

export const updateLineItem = (productId, data) => {
  const lineItem = getLineItemByProductId(productId);
  // we have a line item, update it
  return lineItem?.id
    ? updateCheckoutLineItem({
        id: lineItem.id,
        data: {
          ...{
            price: lineItem.price.id,
            ...(lineItem?.ad_hoc_amount ? { ad_hoc_amount: lineItem?.ad_hoc_amount } : {}),
          },
          ...data,
        },
      })
    : addCheckoutLineItem(data);
};
