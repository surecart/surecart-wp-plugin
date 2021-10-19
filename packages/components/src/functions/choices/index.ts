import { ProductChoices, RecursivePartial, Product } from '../../types';

/**
 * Gets a product's price id by index
 *
 * @param productId string  The product id  (required)
 * @param products ProductChoices  The product choices  (required)
 * @param index number  The index of the product choice
 *
 * @returns string
 */
export const getProductPriceIdByIndex = (productId: string, products: ProductChoices, index: number = 0) => {
  return Object.keys(products[productId].prices)[index];
};

/**
 * Gets a product's price id by index
 *
 * @param productId string  The product id  (required)
 * @param products ProductChoices  The product choices  (required)
 * @param index number  The index of the product choice
 *
 * @returns string
 */
export const getProductPriceByIndex = (productId: string, products: ProductChoices, index: number = 0) => {
  const id = getProductPriceIdByIndex(productId, products, index);
  return {
    id,
    ...products[productId].prices[id],
  };
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
      return Object.keys(choices[id].prices)
        .filter(priceId => {
          return choices[id].prices[priceId].enabled;
        })
        .map(priceId => {
          const price = choices[id].prices[priceId];
          return {
            id: priceId,
            quantity: price.quantity || 1,
          };
        });
    })
    .flat();
};

/**
 * Get a products chosen prices
 *
 * @param product Product.
 * @param choices Product choices.
 */
export const getAvailablePricesForProduct = (product: RecursivePartial<Product>, choices: RecursivePartial<ProductChoices>) => {
  const choice = choices[product.id];
  if (!choice || !Object.keys(choice?.prices || {}).length) {
    return [];
  }
  return (product.prices || []).filter(price => {
    return choice.prices[price.id]?.enabled;
  });
};
