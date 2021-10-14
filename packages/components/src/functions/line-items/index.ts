import { ProductChoices, RecursivePartial, ChoiceType, lineItems } from '../../types';

import { getChoicePrices } from '../choices';

/**
 * Get all chosen price ids.
 *
 * @param choices Product choices.
 * @returns Array of ids.
 */
export const getProductsFirstPriceId = (id: string, choices: ProductChoices) => {
  return Object.keys(choices[id].prices)[0];
};

/**
 * Calculates the initial line items for the session.
 */
export const calculateInitialLineItems = (choices: ProductChoices, choiceType: ChoiceType) => {
  if (choiceType === 'all') {
    return getChoicePrices(choices);
  } else {
    return [getChoicePrices(choices)?.[0]];
  }
};

/**
 * Get price ids from line items
 * @param checkoutSession
 * @returns
 */
export const getLineItemPriceIds = (line_items: RecursivePartial<lineItems>) => {
  return line_items.map(item => item.price.id);
};
