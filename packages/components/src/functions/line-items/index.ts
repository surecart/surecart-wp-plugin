import { ProductChoices, RecursivePartial, ChoiceType, lineItems, Product, CheckoutSession, Price } from '../../types';
import { getChoicePrices } from '../choices';

/**
 * Calculates the initial line items for the session.
 */
export const calculateInitialLineItems = (choices: RecursivePartial<ProductChoices>, choiceType: ChoiceType) => {
  if (choiceType === 'all') {
    return getChoicePrices(choices).map(choice => {
      return {
        price_id: choice.id,
        quantity: choice?.quantity || 1,
      };
    });
  } else {
    return [getChoicePrices(choices)?.[0]].map(choice => {
      return {
        price_id: choice.id,
        quantity: choice?.quantity || 1,
      };
    });
  }
};

/**
 * Get price ids from line items
 * @param checkoutSession
 * @returns
 */
export const getLineItemPriceIds = (line_items: RecursivePartial<lineItems>) => {
  return (line_items || []).map(item => item.price.id);
};

/**
 * Is this product in the checkout session?
 */
export const isProductInCheckoutSession = (product: RecursivePartial<Product>, checkoutSession: CheckoutSession) => {
  const priceIds = getLineItemPriceIds(checkoutSession?.line_items);
  if (!priceIds) return false;
  return !!(product?.prices || []).find(price => priceIds.find(id => id == price?.id));
};

/**
 * Is the price in a checkout session
 */
export const isPriceInCheckoutSession = (price: RecursivePartial<Price>, checkoutSession: CheckoutSession) => {
  const priceIds = getLineItemPriceIds(checkoutSession?.line_items);
  return !!priceIds.find(id => price.id === id);
};
