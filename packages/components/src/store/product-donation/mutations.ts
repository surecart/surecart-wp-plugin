import { addCheckoutLineItem, updateCheckoutLineItem } from '@store/checkout/mutations';
import { getLineItem } from './getters';

export const updateLineItem = (productId, data) => {
  const lineItem = getLineItem(productId);
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
