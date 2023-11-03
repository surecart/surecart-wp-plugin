import { Price, ProductState } from 'src/types';
/**
 * Internal dependencies.
 */
import state from './store';
import { isProductVariantOptionMissing, isProductVariantOptionSoldOut } from '@store/utils';
import { getVariantFromValues } from '../../functions/util';

/**
 * Available product prices
 *
 * @param {string} productId - Product ID
 *
 * @returns {Price[]} - Returns an array of prices that are not archived
 */
export const availablePrices = (productId: string): Price[] => (state[productId]?.prices || []).filter(price => !price?.archived).sort((a, b) => a?.position - b?.position); // sort by position

/**
 * Get Product
 *
 * @param {string} productId - Product ID
 *
 * @returns {ProductState} - Returns the product state
 */
export const getProduct = (productId?: string): ProductState => {
  if (!productId) return null;

  return state[productId];
};
/**
 * Check if product label stock is enabled and not out of stock purchases are allowed.
 *
 * @returns {boolean} - Returns stock needs to be checked or not
 */
export const isStockNeedsToBeChecked = (productId: string) => !!(state[productId].product?.stock_enabled && !state[productId].product?.allow_out_of_stock_purchases);

/**
 * Check if this option is out of stock base on the selected variant.
 */
export const isOptionSoldOut = (productId: string, optionNumber: number, option: string) =>
  isProductVariantOptionSoldOut(optionNumber, option, state[productId].variantValues, state[productId].product);

/**
 * Check if this option is out of stock base on the selected variant.
 */
export const isOptionMissing = (productId: string, optionNumber: number, option: string) =>
  isProductVariantOptionMissing(optionNumber, option, state[productId].variantValues, state[productId].product);

/**
 * Is product out of stock.
 *
 * @returns {boolean} - Returns true if product is out of stock
 */
export const isProductOutOfStock = (productId: string) => {
  // If stock doesn't need to be checked, product is not out of stock.
  if (!isStockNeedsToBeChecked(productId)) {
    return false;
  }

  // If no variant is selected, check against product stock.
  if (!state?.selectedVariant) return state[productId].product?.available_stock <= 0;

  // Check against selected variant's stock.
  return state[productId].selectedVariant?.available_stock <= 0;
};

export const isSelectedVariantMissing = (productId: string) =>
  !!state[productId].variants?.length && getVariantFromValues({ variants: state[productId].variants, values: state[productId].variantValues })?.id === undefined;
