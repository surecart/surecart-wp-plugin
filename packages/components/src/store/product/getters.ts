import { Price, ProductState } from 'src/types';

/**
 * Internal dependencies.
 */
import state from './store';
import { getSerializedState, isProductVariantOptionMissing, isProductVariantOptionSoldOut } from '@store/utils';
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
 */
export const getProduct = (productId?: string): ProductState => state[productId] ?? null;

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

/**
 * Is the selected variant missing.
 */
export const isSelectedVariantMissing = (productId: string) =>
  !!state[productId].variants?.length && getVariantFromValues({ variants: state[productId].variants, values: state[productId].variantValues })?.id === undefined;

/**
 * Get product default state
 *
 * @returns {ProductState} - Returns the product state
 */
export const getDefaultState = (): { [key: string]: ProductState } => {
  const { product: serializedProductState } = getSerializedState();

  return (
    Object.values(serializedProductState as { [key: string]: ProductState }).reduce((acc, productState) => {
      const { selectedPrice, product, selectedVariant } = productState || {};
      const current: ProductState = {
        ...productState,
        quantity: 1,
        total: null,
        dialog: null,
        busy: false,
        error: null,
        adHocAmount: selectedPrice?.amount || null,
        disabled: selectedPrice?.archived || product?.archived,
        line_item: {
          price_id: selectedPrice?.id,
          quantity: 1,
          ...(selectedPrice?.ad_hoc ? { ad_hoc_amount: selectedPrice?.amount } : {}),
        },
        variantValues: {
          ...(selectedVariant?.option_1 ? { option_1: selectedVariant?.option_1 } : {}),
          ...(selectedVariant?.option_2 ? { option_2: selectedVariant?.option_2 } : {}),
          ...(selectedVariant?.option_3 ? { option_3: selectedVariant?.option_3 } : {}),
        },
      };

      acc[product.id] = current;

      return acc;
    }, {}) || {}
  );
};
