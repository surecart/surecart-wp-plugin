import { ProductChoices, PriceData, CheckoutSession, LineItemData, RecursivePartial } from '../types';
import { deepEqual } from './util';

/**
 * Get all chosen price ids.
 *
 * @param choices Product choices.
 * @returns Array of ids.
 */
export const getChoicePriceIds = (choices: RecursivePartial<ProductChoices>) => {
  return Object.keys(choices)
    .map(id => {
      return choices[id].prices;
    })
    .flat();
};

/**
 * Calculates the initial line items for the session.
 */
export const calculateInitialLineItems = (choices: ProductChoices, priceData: Array<PriceData>) => {
  const price_id = getChoicePriceIds(choices)?.[0];
  return price_id ? [{ price_id, quantity: 1 }, ...(priceData || [])] : [];
};

export const getLineItemPriceIds = (checkoutSession: CheckoutSession) => {
  return checkoutSession?.line_items.map(item => item.price.id);
};

export const getLineItemDataFromCheckoutSession = (checkoutSession: CheckoutSession) => {
  return checkoutSession.line_items.map(item => {
    return {
      price_id: item?.price?.id,
      quantity: item?.quantity,
    };
  });
};

/**
 * Did the line items change in the checkout session?
 */
export const didLineItemsChange = (checkoutSession: CheckoutSession, lineItemData: Array<LineItemData>) => {
  let sessionLineItemData = getLineItemDataFromCheckoutSession(checkoutSession);

  return deepEqual(sessionLineItemData, lineItemData);
};
