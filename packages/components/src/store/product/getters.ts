import { getVariantFromValues } from '../../functions/util';
import state from './store';
import { state as checkoutState } from '@store/checkout';
/**
 * Available product prices
 * @returns {Price[]} - Returns an array of prices that are not archived
 */
export const availablePrices = () => (state.prices || []).filter(price => !price?.archived).sort((a, b) => a?.position - b?.position); // sort by position

export const availableVariantOptions = (type: 'product-page' | 'instant-checkout-page' = 'product-page') =>
  (
    ('product-page' === type && state?.variant_options
      ? state.variant_options
      : 'instant-checkout-page' === type && checkoutState?.product?.variant_options?.data
      ? checkoutState?.product?.variant_options?.data
      : state?.variant_options) || []
  )?.map(({ id, name, values }) => {
    return {
      id,
      name,
      values: values?.map(label => ({
        label,
        value: label,
      })),
    };
  });

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

  const values = {
    ...(state.selectedVariant.option_1 ? { option_1: state.selectedVariant.option_1 } : {}),
    ...(state.selectedVariant.option_2 ? { option_2: state.selectedVariant.option_2 } : {}),
    ...(state.selectedVariant.option_3 ? { option_3: state.selectedVariant.option_3 } : {}),
    [`option_${optionNumber}`]: option,
  };

  const matchedVariant = getVariantFromValues({ variants: state.variants, values });

  return matchedVariant?.stock <= 0;
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

/**
 * Get selected product stock.
 *
 * @returns {number} - Returns product stock
 */
export const getSelectedProductStock = () => {
  // If no variant is selected, check against product stock.
  if (!state?.selectedVariant) return state.product?.stock;

  // Check against selected variant's stock.
  return state.selectedVariant?.stock;
};
