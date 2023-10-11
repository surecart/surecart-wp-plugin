import state from './store';
import { state as checkoutState } from '@store/checkout';
/**
 * Available product prices
 * @returns {Price[]} - Returns an array of prices that are not archived
 */
export const availablePrices = () => (state.prices || []).filter(price => !price?.archived).sort((a, b) => a?.position - b?.position); // sort by position

export const availableVariants = (type: 'product-page' | 'instant-checkout-page' = 'product-page') =>
  ('product-page' === type && state?.variants
    ? state.variants
    : 'instant-checkout-page' === type && checkoutState?.product?.variants?.data
    ? checkoutState?.product?.variants?.data
    : state?.variants) || [];

/**
 * Check if product label stock is enabled and not out of stock purchases are allowed.
 *
 * @returns {boolean} - Returns stock needs to be checked or not
 */
export const isStockNeedsToBeChecked = !!(state.product?.stock_enabled && !state.product?.allow_out_of_stock_purchases);

/**
 * Check if this option is out of stock base on the selected variant.
 */
export const isOptionSoldOut = (optionNumber: number, option: string) => {
  // stock does not need to be checked.
  if (!isStockNeedsToBeChecked) {
    return false;
  }

  // if this is option 1, check to see if there are any variants with this option.
  if (optionNumber === 1) {
    const items = state.variants.filter(variant => variant.option_1 === option);
    const highestStock = Math.max(...items.map(item => item.stock));
    return highestStock <= 0;
  }

  // if this is option 2, check to see if there are any variants with this option and option 1
  if (optionNumber === 2) {
    const items = state.variants.filter(variant => variant?.option_1 === state.selectedVariant.option_1 && variant.option_2 === option);
    const highestStock = Math.max(...items.map(item => item.stock));
    return highestStock <= 0;
  }

  // if this is option 4, check to see if there are any variants with all the options.
  const items = state.variants.filter(
    variant => variant?.option_1 === state.selectedVariant.option_1 && variant?.option_2 === state.selectedVariant.option_2 && variant.option_2 === option,
  );
  const highestStock = Math.max(...items.map(item => item.stock));
  return highestStock <= 0;
};

/**
 * Is product out of stock.
 *
 * @returns {boolean} - Returns true if product is out of stock
 */
export const isProductOutOfStock = () => {
  // If stock doesn't need to be checked, product is not out of stock.
  if (!isStockNeedsToBeChecked) {
    return false;
  }

  // If no variant is selected, check against product stock.
  if (!state?.selectedVariant) return state.product?.stock <= 0;

  // Check against selected variant's stock.
  return state.selectedVariant?.stock <= 0;
};
