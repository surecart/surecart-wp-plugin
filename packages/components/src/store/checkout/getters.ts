import { Price, Product } from 'src/types';
import { getCheckout } from '../checkouts/mutations';
import state from './store';

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
 * Get the first upsell from the checkout.
 */
export const getUpsell = () => (state?.checkout?.recommended_upsells?.data || []).sort((a, b) => a?.priority - b?.priority).find(u => (u.price as Price)?.ad_hoc === false);

/**
 * Is the shipping address required?
 */
export const fullShippingAddressRequired = () => state.checkout?.shipping_enabled || state?.checkout?.shipping_address_required;

/**
 * Is the address required?
 */
export const shippingAddressRequired = () =>
  state.checkout?.tax_status === 'address_invalid' || state.checkout?.shipping_enabled || state.checkout?.shipping_address_required || state?.checkout?.tax_enabled;
