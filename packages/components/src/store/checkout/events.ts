import '../checkouts/events';
import state, { on } from './store';
import { Checkout, LineItem } from 'src/types';

/**
 * Checkout initiated event.
 */
on('set', (key, checkout: Checkout, oldCheckout: Checkout) => {
  if (key !== 'checkout') return; // we only care about checkout
  if (oldCheckout?.id) return; // we only care about new checkouts.
  if (!checkout?.id) return; // we don't have a saved checkout.
  if (!state.isCheckoutPage) return; // we don't want to fire this if we are not on the checkout page.

  const event = new CustomEvent<Checkout>('scCheckoutInitiated', {
    detail: checkout,
    bubbles: true,
  });

  document.dispatchEvent(event);
});

/**
 * Purchase complete, trial start event.
 */
on('set', (key, checkout: Checkout, oldCheckout: Checkout) => {
  if (key !== 'checkout') return; // we only care about checkout
  if (!checkout?.status || oldCheckout?.status === checkout?.status) return; // we only care about status changes.
  if (!['paid', 'processing'].includes(checkout.status)) return; // only if it's paid or processing.

  // order paid is deprecated.
  const deprecated = new CustomEvent('scOrderPaid', { detail: checkout, bubbles: true });
  document.dispatchEvent(deprecated);

  // emit the new event.
  const event = new CustomEvent('scCheckoutCompleted', { detail: checkout, bubbles: true });
  document.dispatchEvent(event);

  // get trial line items and emit trial event if there are any.
  const trialLineItems: LineItem[] = (checkout?.line_items?.data || []).filter(item => item?.price?.trial_duration_days > 0);
  if (trialLineItems.length > 0) {
    const event = new CustomEvent('scTrialStarted', { detail: trialLineItems, bubbles: true });
    document.dispatchEvent(event);
  }

  // get subscription line items and emit subscription event if there are any.
  const subscriptionLineItems: LineItem[] = (checkout?.line_items?.data || []).filter(item => item?.price?.recurring_interval_count > 0);
  if (subscriptionLineItems.length > 0) {
    const event = new CustomEvent('scSubscriptionStarted', { detail: subscriptionLineItems, bubbles: true });
    document.dispatchEvent(event);
  }
});

/**
 * Shipping info added event.
 */
on('set', (key, checkout: Checkout, oldCheckout: Checkout) => {
  if (key !== 'checkout') return; // we only care about checkout
  if (!state.isCheckoutPage) return; // we don't want to fire this if we are not on the checkout page.
  if (!checkout?.selected_shipping_choice) return; // we only care about shipping info.
  if (oldCheckout?.selected_shipping_choice === checkout?.selected_shipping_choice) return; // we only care about new shipping info.

  const event = new CustomEvent<Checkout>('scShippingInfoAdded', {
    detail: checkout,
    bubbles: true,
  });
  document.dispatchEvent(event);
});

/**
 * Checkout updated event.
 */
on('set', (key: string, checkout: Checkout, oldCheckout: Checkout) => {
  if (key !== 'checkout') return; // we only care about checkout
  if (!state.isCheckoutPage) return; // we don't want to fire this if we are not on the checkout page.
  if (!oldCheckout?.id) return; // we don't have a saved checkout.
  if (JSON.stringify(checkout) === JSON.stringify(oldCheckout)) return; // we only care about changes.

  const event = new CustomEvent('scCheckoutUpdated', {
    detail: {
      currentCheckout: checkout,
      previousCheckout: oldCheckout,
    },
    bubbles: true,
  });
  document.dispatchEvent(event);
});
