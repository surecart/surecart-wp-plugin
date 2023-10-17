import { getVariantFromValues } from 'src/functions/util';
import state from './store';
/**
 * Available product prices
 * @returns {Price[]} - Returns an array of prices that are not archived
 */
export const availablePrices = () => (state.prices || []).filter(price => !price?.archived).sort((a, b) => a?.position - b?.position); // sort by position

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
    const highestStock = Math.max(...items.map(item => item.available_stock));
    return highestStock <= 0;
  }

  // if this is option 2, check to see if there are any variants with this option and option 1
  if (optionNumber === 2) {
    const items = state.variants.filter(variant => variant?.option_1 === state.variantValues.option_1 && variant?.option_2 === option);
    const highestStock = Math.max(...items.map(item => item.available_stock));
    return highestStock <= 0;
  }

  // if this is option 3, check to see if there are any variants with all the options.
  const items = state.variants.filter(
    variant => variant?.option_1 === state.variantValues.option_1 && variant?.option_2 === state.variantValues.option_2 && variant?.option_3 === option,
  );
  const highestStock = Math.max(...items.map(item => item.available_stock));
  return highestStock <= 0;
};

/**
 * Check if this option is out of stock base on the selected variant.
 */
export const isOptionMissing = (optionNumber: number, option: string) => {
  // if this is option 1, check to see if there are any variants with this option.
  if (optionNumber === 1) {
    return !state.variants.some(variant => variant.option_1 === option);
  }

  // if this is option 2, check to see if there are any variants with this option and option 1
  if (optionNumber === 2) {
    return !state.variants.some(variant => variant?.option_1 === state.variantValues.option_1 && variant.option_2 === option);
  }

  // if this is option 3, check to see if there are any variants with all the options.
  return !state.variants.some(variant => variant?.option_1 === state.variantValues.option_1 && variant?.option_2 === state.variantValues.option_2 && variant.option_3 === option);
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
  if (!state?.selectedVariant) return state.product?.available_stock <= 0;

  // Check against selected variant's stock.
  return state.selectedVariant?.available_stock <= 0;
};

export const isSelectedVariantMissing = () => getVariantFromValues({ variants: state.variants, values: state.variantValues })?.id === undefined;
