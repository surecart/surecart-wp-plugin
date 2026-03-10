import { Product, Address, Checkout } from 'src/types';
import { getCheckout } from '../checkouts/mutations';
import state from './store';
import { isAddressComplete } from 'src/functions/address';

/**
 * Gets the current checkout for the page.
 */
export const currentCheckout = () => getCheckout(state.formId, state.mode);

/**
 * Is the checkout currently locked.
 * Pass an optional lock name to find if a
 * specific lock name is locking checkout.
 */
export const checkoutIsLocked = (lockName = ''): boolean => (lockName ? state.locks.some(name => name === lockName) : !!state.locks?.length);

/**
 * Get a line item by product id.
 */
export const getLineItemByProductId = (productId: string) => (state.checkout?.line_items?.data || []).find(line_item => (line_item?.price?.product as Product)?.id === productId);

/**
 * Is the shipping address required?
 */
export const fullShippingAddressRequired = () => state.checkout?.shipping_address_accuracy_requirement === 'full';

/**
 * Is the address required?
 */
export const shippingAddressRequired = () => state.checkout?.shipping_address_accuracy_requirement === 'full' || state.checkout?.shipping_address_accuracy_requirement === 'tax';

/**
 * Get Billing address
 */
export const getCompleteAddress = (type: 'shipping' | 'billing' = 'shipping') => {
  const isComplete = isAddressComplete(state.checkout?.[`${type}_address`] as Address);
  if (!isComplete) return;

  const { line_1: line1, line_2: line2, ...otherProps } = (state.checkout?.[`${type}_address`] as Address) || {};

  return {
    line1,
    line2,
    ...otherProps,
  };
};

/**
 * Get the resolved billing address for payment processors.
 * Falls back to shipping address when billing matches shipping.
 * Returns Stripe-formatted address fields (line1/line2 instead of line_1/line_2).
 */
export const getResolvedBillingAddress = (checkout?: Checkout) => {
  const currentOrder = checkout || state.checkout;

  const billingAddress = (
    currentOrder?.billing_matches_shipping === false && currentOrder?.billing_address
      ? currentOrder.billing_address
      : undefined
  ) as Address;

  const shippingAddress = (currentOrder?.shipping_address as Address) || {};

  const { line_1: line1, line_2: line2, city, state: addressState, country, postal_code } =
    billingAddress?.line_1 ? billingAddress : shippingAddress;

  if (!line1) return {};

  return { address: { line1, line2, city, state: addressState, postal_code, country } };
};
