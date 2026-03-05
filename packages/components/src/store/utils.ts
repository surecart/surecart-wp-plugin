import { Product, Variant } from '../types';

const isObject = item => item && typeof item === 'object' && !Array.isArray(item);

export const getSerializedState = () => {
  const storeTag = document.querySelector(`script[type="application/json"]#sc-store-data`);
  if (!storeTag) return {};
  try {
    const state = JSON.parse(storeTag.textContent);
    if (isObject(state)) return state;
    throw Error('Parsed state is not an object');
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
  return {};
};

/**
 * Is this variant option sold out.
 */
export const isProductVariantOptionSoldOut = (optionNumber, option, variantValues, product: Product) => {
  const getEffectiveStock = (variant: Variant): number => {
    // null means "inherit from product" — fall back to product's has_unlimited_stock
    const effectiveUnlimited = variant?.has_unlimited_stock ?? product?.has_unlimited_stock;
    if (effectiveUnlimited) return Infinity;
    return variant.available_stock;
  };

  const isGroupSoldOut = (items: Variant[]): boolean => {
    if (!items.length) return false;
    return Math.max(...items.map(getEffectiveStock)) <= 0;
  };

  // if this is option 1, check to see if there are any variants with this option.
  if (optionNumber === 1) {
    const items = (product.variants?.data || []).filter?.(variant => variant.option_1 === option);
    return isGroupSoldOut(items);
  }

  // if this is option 2, check to see if there are any variants with this option and option 1
  if (optionNumber === 2) {
    const items = (product.variants?.data || []).filter(variant => variant?.option_1 === variantValues.option_1 && variant.option_2 === option);
    return isGroupSoldOut(items);
  }

  // if this is option 3, check to see if there are any variants with all the options.
  const items = (product.variants?.data || []).filter(
    variant => variant?.option_1 === variantValues.option_1 && variant?.option_2 === variantValues.option_2 && variant.option_3 === option,
  );
  return isGroupSoldOut(items);
};

/**
 * Is this variant option missing/unavailable?
 */
export const isProductVariantOptionMissing = (optionNumber: number, option: string, variantValues, product: Product) => {
  // if this is option 1, check to see if there are any variants with this option.
  if (optionNumber === 1) {
    return !(product?.variants?.data || []).some(variant => variant.option_1 === option);
  }

  // if this is option 2, check to see if there are any variants with this option and option 1
  if (optionNumber === 2) {
    return !(product?.variants?.data || []).some(variant => variant?.option_1 === variantValues.option_1 && variant.option_2 === option);
  }

  // if this is option 3, check to see if there are any variants with all the options.
  return !(product?.variants?.data || []).some(
    variant => variant?.option_1 === variantValues.option_1 && variant?.option_2 === variantValues.option_2 && variant.option_3 === option,
  );
};
