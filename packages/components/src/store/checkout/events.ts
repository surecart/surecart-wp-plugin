import '../checkouts/events';
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
});
