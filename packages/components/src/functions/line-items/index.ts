import { getQueryArg } from '@wordpress/url';
import { RecursivePartial, ChoiceType, lineItems, Product, CheckoutSession, Price, PriceChoice, LineItemData } from '../../types';

// Get only enabled price choices.
export const getEnabledPriceChoices = (choices: Array<PriceChoice>): Array<PriceChoice> => {
  return (choices || []).filter(choice => choice?.enabled !== false);
};

// convert price choice to line item data.
export const convertPriceChoiceToLineItemData = (choice: PriceChoice): LineItemData => {
  return {
    price_id: choice.id,
    quantity: choice.quantity,
  };
};

// convert line items to price ids
export const convertLineItemsToPriceIds = (lineItems: RecursivePartial<lineItems>): Array<string> => {
  return (lineItems?.data || []).map(item => item.price.id);
};

export const convertLineItemsToLineItemData = (
  lineItems: RecursivePartial<lineItems>,
): Array<{
  price_id: string;
  quantity: number;
}> => {
  return (lineItems?.data || []).map(item => {
    return {
      price_id: item.price.id,
      quantity: item.quantity,
    };
  });
};

export const addLineItem = (lineItems: RecursivePartial<lineItems>, data: { price_id: string; quantity: number }) => {
  const lineItemData = convertLineItemsToLineItemData(lineItems);
  const index = lineItemData.findIndex(item => item.price_id === data.price_id);
  lineItemData[index] = data;
  return lineItemData;
};
/**
 * Calculates the initial line items for the session.
 */
export const calculateInitialLineItems = (choices: Array<PriceChoice>, choiceType: ChoiceType) => {
  // check the url query first.
  const prices = (getQueryArg(window.location.href, 'prices') as unknown) as Array<PriceChoice>;
  if (prices) {
    return prices.map(convertPriceChoiceToLineItemData);
  }

  // get prices from choices.
  return getInitialChoiceLineItems(choices, choiceType);
};

/**
 * Get the initial choice line items.
 */
export const getInitialChoiceLineItems = (choices: Array<PriceChoice>, choiceType: ChoiceType) => {
  if (choiceType === 'all') {
    return getEnabledPriceChoices(choices).map(convertPriceChoiceToLineItemData);
  } else {
    return [getEnabledPriceChoices(choices).map(convertPriceChoiceToLineItemData)?.[0]];
  }
};

/**
 * Get price ids from line items
 * @param checkoutSession
 * @returns
 */
export const getLineItemPriceIds = (line_items: RecursivePartial<lineItems>) => {
  return (line_items?.data || []).map(item => item.price.id);
};

export const getLineItemPrices = (line_items: RecursivePartial<lineItems>) => {
  return (line_items?.data || []).map(item => item.price);
};

export const getLineItemByPriceId = (line_items: RecursivePartial<lineItems>, priceId: string) => {
  return (line_items?.data || []).find(item => item.price.id === priceId);
};

/**
 * Is this product in the checkout session?
 */
export const isProductInCheckoutSession = (product: RecursivePartial<Product>, checkoutSession: CheckoutSession) => {
  const prices = getLineItemPrices(checkoutSession?.line_items);
  if (!prices?.length) return false;
  return !!prices.find(price => price?.product?.id === product.id);
};

/**
 * Is the price in a checkout session
 */
export const isPriceInCheckoutSession = (price: RecursivePartial<Price>, checkoutSession: CheckoutSession) => {
  const priceIds = getLineItemPriceIds(checkoutSession?.line_items);
  return !!priceIds.find(id => price.id === id);
};

/**
 * Attempt to get the session id
 *
 * @param formId The form id.
 * @param checkoutSession The checkoutSession
 * @param refresh Should we refresh?
 *
 * @returns string
 */
export const getSessionId = (formId, checkoutSession, refresh = false) => {
  // if we want to get a fresh session, skip
  if (refresh === true) {
    return false;
  }

  // if we already have an ID set, return that:
  if (checkoutSession?.id) {
    return checkoutSession.id;
  }

  // check the url query first
  const urlId = getQueryArg(window.location.href, 'checkout_session');
  if (urlId) {
    return urlId;
  }

  // check id in localstorage
  return window.localStorage.getItem(formId);
};
