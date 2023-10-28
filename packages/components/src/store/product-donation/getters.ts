import { state as CheckoutState } from '../checkout/store';
import { state } from './store';
import { isInRange } from '../../functions/util';

/**
 * Get the line item for the donation product.
 */
export const getLineItem = productId => {
  return (CheckoutState.checkout?.line_items?.data || []).find(item => {
    if (typeof item.price.product === 'object') {
      return item.price?.product?.id === productId;
    }
    return item.price?.product === productId;
  });
};

/**
 * Get the valid ad hoc amount selected price on the product.
 */
export const getValidAdHocAmount = productId => {
  const val = state[productId];
  const validAmounts = (val.amounts || []).filter(amount => isInRange(amount, val.selectedPrice));
  return validAmounts.includes(val?.ad_hoc_amount) ? val?.ad_hoc_amount : validAmounts[0];
};
