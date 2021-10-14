import { ProductChoices, RecursivePartial } from '../../types';

/**
 * Get a products first price id
 *
 * @param choices Product choices.
 * @returns Array of ids.
 */
export const getProductsFirstPriceId = (id: string, choices: ProductChoices) => {
  return Object.keys(choices[id].prices)[0];
};

/**
 * Get all chosen price ids.
 *
 * @param choices Product choices.
 * @returns Array of ids.
 */
export const getChoicePrices = (choices: RecursivePartial<ProductChoices>) => {
  return Object.keys(choices)
    .map(id => {
      return Object.keys(choices[id].prices).map(priceId => {
        const price = choices[id].prices[priceId];
        return {
          id: priceId,
          quantity: price.quantity || 1,
        };
      });
    })
    .flat();
};
