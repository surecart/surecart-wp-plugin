import state, { onChange, on } from './store';
import { getCheckout, setCheckout } from '../checkouts';
import { Checkout, CheckoutInitiatedParams, Product } from 'src/types';
import { maybeConvertAmount } from 'src/functions/currency';

/**
 * When the checkout changes, update the
 * checkout in localstorage.
 */
onChange('checkout', val => setCheckout(val, state.formId));

on('get', prop => {
  if (prop === 'checkout') {
    const checkout = getCheckout(state.formId, state.mode);
    if (checkout?.id) {
      state.checkout = checkout;
    }
  }
});

/**
 * Checkout initiated event.
 */
on('set', (key, newValue, oldValue) => {
  if (key !== 'checkout') return; // we only care about checkout
  if (oldValue?.id) return; // we only care about new checkouts.

  const detail: CheckoutInitiatedParams = {
    transaction_id: newValue.checkout.id,
    value: maybeConvertAmount(newValue.checkout?.total_amount, newValue.checkout?.currency || 'USD'),
    currency: (newValue.checkout.currency || '').toUpperCase(),
    ...(newValue.checkout?.discount?.promotion?.code ? { coupon: newValue.checkout?.discount?.promotion?.code } : {}),
    ...(newValue.checkout?.tax_amount ? { tax: maybeConvertAmount(newValue.checkout?.tax_amount, newValue.checkout?.currency || 'USD') } : {}),
    items: (newValue.checkout?.line_items?.data || []).map(item => ({
      item_name: (item?.price?.product as Product)?.name || '',
      discount: item?.discount_amount ? maybeConvertAmount(item?.discount_amount || 0, newValue.checkout?.currency || 'USD') : 0,
      price: maybeConvertAmount(item?.price?.amount || 0, newValue.checkout?.currency || 'USD'),
      quantity: item?.quantity || 1,
    })),
  };

  const event = new CustomEvent('scCheckoutInitiated', { detail });
  window.dispatchEvent(event);
});

/**
 * Add to cart/remove from cart, cart updated events.
 */
on('set', (key, newValue, oldValue) => {
  // we only care about checkout.
  if (key !== 'checkout') return;

  // get new and old line items.
  const newLineItems = (newValue.checkout as Checkout)?.line_items?.data || [];
  const oldLineItems = (oldValue.checkout as Checkout)?.line_items?.data || [];

  // check for added items
  newLineItems.forEach(newItem => {
    const oldItem = oldLineItems.find(item => item.id === newItem.id);
    if (!oldItem) {
      const event = new CustomEvent('scAddedToCart', { detail: newItem });
      window.dispatchEvent(event);
    }
  });

  // check for removed items
  oldLineItems.forEach(oldItem => {
    const newItem = newLineItems.find(item => item.id === oldItem.id);
    if (!newItem) {
      const event = new CustomEvent('scRemovedFromCart', { detail: oldItem });
      window.dispatchEvent(event);
    }
  });

  // check if line items have changed.
  if (JSON.stringify(newLineItems) !== JSON.stringify(oldLineItems)) {
    // emit an event here with the checkout state updates.
    const event = new CustomEvent('scUpdateCart', { detail: [newValue, oldValue] });
    window.dispatchEvent(event);
  }
});
