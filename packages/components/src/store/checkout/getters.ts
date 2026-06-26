import { Product, Address, Checkout, Customer } from 'src/types';
import { getCheckout } from '../checkouts/mutations';
import state from './store';
import { state as userState } from '../user';
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
 * Get a complete address by type, with Stripe-formatted field names (line1/line2).
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
 * Returns canonical Address format (line_1/line_2).
 */
export const getResolvedBillingAddress = (checkout?: Checkout): Address | undefined => {
  const currentOrder = checkout || state.checkout;

  const billingAddress =
    currentOrder?.billing_matches_shipping === false && currentOrder?.billing_address
      ? (currentOrder.billing_address as Address)
      : undefined;

  const address = billingAddress?.line_1 ? billingAddress : (currentOrder?.shipping_address as Address);

  if (!address?.line_1) return undefined;

  return address;
};

/**
 * Resolve the billing email for payment processors.
 *
 * The Stripe Payment Element is created with `fields.billing_details.email = 'never'`,
 * so an email must always be passed on confirm. Logged-in customers never fill the email
 * input, so fall back to the linked customer and the logged-in user session.
 */
export const getResolvedBillingEmail = (checkout?: Checkout): string | undefined => {
  const currentOrder = checkout || state.checkout;
  return currentOrder?.email || (currentOrder?.customer as Customer)?.email || userState?.email || undefined;
};

/**
 * Convert a canonical Address to Stripe's expected format (line1/line2 instead of line_1/line_2).
 */
export const toStripeAddress = (address?: Address) => {
  if (!address?.line_1) return undefined;

  const { line_1: line1, line_2: line2, city, state: addressState, country, postal_code } = address;
  return { line1, line2, city, state: addressState, postal_code, country };
};
