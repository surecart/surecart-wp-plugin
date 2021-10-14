import { CheckoutSession, Product, Price, ProductChoices, RecursivePartial } from '../../../types';

import { getChoicePrices, getLineItemPriceIds } from '../../../functions/line-items';

/**
 * Get all chosen price ids.
 *
 * @param choices Product choices.
 * @returns Array of ids.
 */
export const getAvailablePriceIds = (choices: RecursivePartial<ProductChoices>) => {
  return Object.keys(choices)
    .map(id => {
      return choices[id].prices;
    })
    .flat();
};

/**
 * Get a products chosen prices
 *
 * @param product Product.
 * @param choices Product choices.
 *
 * @returns Array of ids.
 */
export const getAvailablePricesForProduct = (product: RecursivePartial<Product>, choices: RecursivePartial<ProductChoices>) => {
  return product.prices.filter(price => {
    return getChoicePrices(choices).some(choice => choice.id == price.id);
  });
};

export const getSelectedProducts = (products: Array<Product>, checkoutSession: CheckoutSession) => {
  const priceIds = getLineItemPriceIds(checkoutSession?.line_items);
  return (products || []).filter(product => (product?.prices || []).find(price => (priceIds || []).find(id => id == price.id)));
};

/**
 * Is the current product selected?
 */
export const isProductSelected = (product: RecursivePartial<Product>, checkoutSession: CheckoutSession) => {
  const priceIds = getLineItemPriceIds(checkoutSession?.line_items);
  if (!priceIds) return false;
  return !!(product?.prices || []).find(price => priceIds.find(id => id == price?.id));
};

export const isPriceSelected = (price: RecursivePartial<Price>, checkoutSession: CheckoutSession) => {
  const priceIds = getLineItemPriceIds(checkoutSession?.line_items);
  return !!priceIds.find(id => price.id === id);
};

export const getSiblings = e => {
  // for collecting siblings
  let siblings = [];
  // if no parent, return no sibling
  if (!e.parentNode) {
    return siblings;
  }
  // first child of the parent node
  let sibling = e.parentNode.firstChild;

  // collecting siblings
  while (sibling) {
    if (sibling.nodeType === 1) {
      siblings.push(sibling);
    }
    sibling = sibling.nextSibling;
  }
  return siblings;
};
