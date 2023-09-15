import { on } from './store';
import { Checkout, CheckoutInitiatedParams, LineItem, Product } from 'src/types';
import { maybeConvertAmount } from '../../functions/currency';

/**
 * Checkout initiated event.
 */
on('set', (key, checkout: Checkout, oldCheckout: Checkout) => {
  if (key !== 'checkout') return; // we only care about checkout
  if (oldCheckout?.id) return; // we only care about new checkouts.
  if (!checkout?.id) return; // we don't have a saved checkout.

  const event = new CustomEvent<CheckoutInitiatedParams>('scCheckoutInitiated', {
    detail: {
      transaction_id: checkout.id,
      value: maybeConvertAmount(checkout?.total_amount, checkout?.currency || 'USD'),
      currency: (checkout.currency || '').toUpperCase(),
      ...(checkout?.discount?.promotion?.code ? { coupon: checkout?.discount?.promotion?.code } : {}),
      ...(checkout?.tax_amount ? { tax: maybeConvertAmount(checkout?.tax_amount, checkout?.currency || 'USD') } : {}),
      items: (checkout?.line_items?.data || []).map(item => ({
        item_name: (item?.price?.product as Product)?.name || '',
        discount: item?.discount_amount ? maybeConvertAmount(item?.discount_amount || 0, checkout?.currency || 'USD') : 0,
        price: maybeConvertAmount(item?.price?.amount || 0, checkout?.currency || 'USD'),
        quantity: item?.quantity || 1,
      })),
    },
  });

  window.dispatchEvent(event);
});

/**
 * Add to cart/remove from cart, cart updated events.
 */
on('set', (key, checkout: Checkout, oldCheckout: Checkout) => {
  // we only care about checkout.
  if (key !== 'checkout') return;

  // get new and old line items.
  const newLineItems = (checkout as Checkout)?.line_items?.data || [];
  const oldLineItems = (oldCheckout as Checkout)?.line_items?.data || [];

  // check for added items
  newLineItems.forEach(newItem => {
    const oldItem = oldLineItems.find(item => item.id === newItem.id);
    if (!oldItem) {
      const event = new CustomEvent<LineItem>('scAddedToCart', { detail: newItem });
      window.dispatchEvent(event);
    }
  });

  // check for removed items
  oldLineItems.forEach(oldItem => {
    const newItem = newLineItems.find(item => item.id === oldItem.id);
    if (!newItem) {
      const event = new CustomEvent<LineItem>('scRemovedFromCart', { detail: oldItem });
      window.dispatchEvent(event);
    }
  });

  // check if line items have changed.
  if (JSON.stringify(newLineItems) !== JSON.stringify(oldLineItems)) {
    // emit an event here with the checkout state updates.
    const event = new CustomEvent<[Checkout, Checkout]>('scCartUpdated', { detail: [checkout, oldCheckout] });
    window.dispatchEvent(event);
  }
});

/**
 * Purchase complete, trial start event.
 */
on('set', (key, checkout: Checkout, oldCheckout: Checkout) => {
  if (key !== 'checkout') return; // we only care about checkout
  if (!checkout?.status || oldCheckout?.status === checkout?.status) return; // we only care about status changes.
  if (!['paid', 'processing'].includes(checkout.status)) return; // only if it's paid or processing.

  // order paid is deprecated.
  const deprecated = new CustomEvent('scOrderPaid', { detail: checkout });
  window.dispatchEvent(deprecated);

  // emit the new event.
  const event = new CustomEvent('scPurchaseComplete', { detail: checkout });
  window.dispatchEvent(event);

  // get trial line items and emit trial event if there are any.
  const trialLineItems: LineItem[] = (checkout?.line_items?.data || []).filter(item => item?.price?.trial_duration_days > 0);
  if (trialLineItems.length > 0) {
    const event = new CustomEvent('scStartTrial', { detail: trialLineItems });
    window.dispatchEvent(event);
  }
});
