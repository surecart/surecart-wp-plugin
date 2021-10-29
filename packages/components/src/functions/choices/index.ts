import { RecursivePartial, Product, PriceChoice, Prices } from '../../types';

export const getProductIdsFromPriceChoices = (priceChoices: Array<PriceChoice>) => {
  return [...new Set(priceChoices.filter(p => p?.enabled !== false).map(p => p.product_id))];
};

/**
 * Gets a product's price id by index
 */
export const getProductChoicePriceByIndex = (productId: string, priceChoices: Array<PriceChoice>, index: number = 0) => {
  return priceChoices.filter(price => price.product_id === productId)?.[index];
};

/**
 * Get all chosen price ids.
 *
 * @param choices Product choices.
 * @returns Array of ids.
 */
export const getChoicePrices = (choices: Array<PriceChoice>) => {
  return (choices || []).filter(choice => choice.enabled);
};

export const getChoicePriceIds = (choices: Array<PriceChoice>) => {
  return getChoicePrices(choices).map(choice => choice.id);
};

/**
 * Get a products chosen prices
 *
 * @param product Product.
 * @param choices Product choices.
 */
export const getAvailablePricesForProduct = (product: RecursivePartial<Product>, prices: Prices, choices: Array<PriceChoice>) => {
  const priceIds = choices.filter(p => p?.enabled !== false && p?.product_id === product.id).map(p => p.id);
  let output = [];
  priceIds.forEach(id => {
    if (prices?.[id]) {
      output.push(prices[id]);
    }
  });
  return output;
};
