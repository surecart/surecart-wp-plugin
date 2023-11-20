/**
 * Internal dependencies.
 */
import state from './store';
import { isProductVariantOptionMissing, isProductVariantOptionSoldOut } from '@store/utils';
import { getVariantFromValues } from '../../functions/util';

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
export const isOptionSoldOut = (optionNumber: number, option: string) => isProductVariantOptionSoldOut(optionNumber, option, state.variantValues, state.product);

/**
 * Check if this option is out of stock base on the selected variant.
 */
export const isOptionMissing = (optionNumber: number, option: string) => isProductVariantOptionMissing(optionNumber, option, state.variantValues, state.product);

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

export const isSelectedVariantMissing = () => !!state.variants?.length && getVariantFromValues({ variants: state.variants, values: state.variantValues })?.id === undefined;
