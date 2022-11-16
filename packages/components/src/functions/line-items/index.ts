import { getQueryArg } from '@wordpress/url';

import { Bump, Checkout, ChoiceType, LineItemData, lineItems, Price, PriceChoice, Product, RecursivePartial } from '../../types';

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
  const prices = getQueryArg(window.location.href, 'prices') as unknown as Array<PriceChoice>;
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
 * @param order
 * @returns
 */
export const getLineItemPriceIds = (line_items: RecursivePartial<lineItems>) => {
  return (line_items?.data || []).map(item => item.price.id);
};

export const getLineItemBumpIds = (line_items: RecursivePartial<lineItems>) => {
  return (line_items?.data || []).map(item => (item?.bump as Bump)?.id || (item?.bump as string));
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
export const isProductInOrder = (product: RecursivePartial<Product>, order: Checkout) => {
  const prices = getLineItemPrices(order?.line_items);
  if (!prices?.length) return false;
  return !!prices.find(price => (price?.product as Product)?.id === product.id);
};

/**
 * Is the price in a checkout session
 */
export const isPriceInOrder = (price: RecursivePartial<Price>, order: Checkout) => {
  const priceIds = getLineItemPriceIds(order?.line_items);
  return !!priceIds.find(id => price?.id === id);
};

/**
 * Is the price in a checkout session
 */
export const isBumpInOrder = (bump: RecursivePartial<Bump>, order: Checkout) => {
  const bumpIds = getLineItemBumpIds(order?.line_items);
  return !!bumpIds.find(id => bump?.id === id);
};

/**
 * Attempt to get the session id
 *
 * @param formId The form id.
 * @param order The order
 * @param refresh Should we refresh?
 *
 * @returns string
 */
export const getSessionId = (formId, order, refresh = false) => {
  // if we want to get a fresh session, skip
  if (refresh === true) {
    return false;
  }

  // if we already have an ID set, return that:
  if (order?.id) {
    return order.id;
  }

  // check the url query first
  const urlId = getQueryArg(window.location.href, 'order');
  if (urlId) {
    return urlId;
  }

  // check id in localstorage
  return window.localStorage.getItem(formId);
};

/** Check if the order has a subscription */
export const hasSubscription = (order: Checkout) => {
  // no line items.
  if (!order?.line_items?.data?.length) return false;
  // has subscription product.
  return order?.line_items.data?.some(item => item?.price?.recurring_interval_count);
};

export const hasTrial = (order: Checkout) => {
  return order?.trial_amount;
};

/** Check if the order has a payment plan. */
export const hasPaymentPlan = (order: Checkout) => {
  return hasSubscription(order) && order?.line_items.data?.some(item => item?.price?.recurring_period_count);
};
