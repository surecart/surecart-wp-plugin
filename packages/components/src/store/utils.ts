import { Product } from '../types';

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
  // product stock is not enabled or out of stock purchases are allowed.
  if (!product?.stock_enabled || product?.allow_out_of_stock_purchases) return false;

  // if this is option 1, check to see if there are any variants with this option.
  if (optionNumber === 1) {
    const items = (product.variants?.data || []).filter?.(variant => variant.option_1 === option);
    const highestStock = Math.max(...items.map(item => item.available_stock));
    return highestStock <= 0;
  }

  // if this is option 2, check to see if there are any variants with this option and option 1
  if (optionNumber === 2) {
    const items = (product.variants?.data || []).filter(variant => variant?.option_1 === variantValues.option_1 && variant.option_2 === option);
    const highestStock = Math.max(...items.map(item => item.available_stock));
    return highestStock <= 0;
  }

  // if this is option 4, check to see if there are any variants with all the options.
  const items = (product.variants?.data || []).filter(
    variant => variant?.option_1 === variantValues.option_1 && variant?.option_2 === variantValues.option_2 && variant.option_3 === option,
  );
  const highestStock = Math.max(...items.map(item => item.available_stock));
  return highestStock <= 0;
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
