import { state } from './store';
import { isInRange } from '../../functions/util';

/**
 * Get the valid ad hoc amount selected price on the product.
 */
export const getValidAdHocAmount = productId => {
  const val = state[productId];
  const validAmounts = (val.amounts || []).filter(amount => isInRange(amount, val.selectedPrice));
  return validAmounts.includes(val?.ad_hoc_amount) ? val?.ad_hoc_amount : validAmounts[0];
};

/**
 * Get the valid ad hoc amount selected price on the product.
 */
export const getInRangeAmounts = productId => {
  const val = state[productId];
  return (val.amounts || []).filter(amount => isInRange(amount, val.selectedPrice));
};
