import { maybeConvertAmount } from '../../functions/currency';
import { Checkout, LineItem, Product } from 'src/types';

/**
 * Handle add to cart event.
 */
window.addEventListener('scAddedToCart', function (e: CustomEvent) {
  if (!window?.fbq) return;

  // get the added item from the event.
  const item: LineItem = e.detail;

  // sanity check.
  if (!item?.price?.product) return;

  const product = item?.price?.product as Product;
  const productCollections: string[] = product?.product_collections?.data?.map(collection => collection.name) || [];

  window.fbq('track', 'AddToCart', {
    ...(productCollections.length ? { content_category: productCollections.join(', ') } : {}),
    content_ids: [product.id],
    content_name: product?.name + (item?.variant_options?.length ? ` - ${item?.variant_options.join(' / ')}` : ''),
    content_type: 'product',
    contents: [
      {
        id: product.id,
        quantity: item.quantity,
      },
    ],
    currency: item?.price?.currency,
    value: maybeConvertAmount(item?.total_amount || 0, item?.price?.currency || 'USD'),
  });
});

/**
 * Handle purchase initiated event.
 */
window.addEventListener('scCheckoutInitiated', function (e: CustomEvent) {
  if (!window?.fbq) return;

  const checkout: Checkout = e.detail;

  window.fbq('track', 'InitiateCheckout', {
    content_ids: (checkout?.line_items.data || [])?.map(item => item.id),
    contents: (checkout?.line_items.data || [])?.map(item => ({ id: item.id, quantity: item.quantity })),
    currency: checkout?.currency,
    num_items: checkout?.line_items?.data?.length || 0,
    value: maybeConvertAmount(checkout?.total_amount, checkout?.currency || 'USD'),
  });
});

/**
 * Handle purchase complete event.
 */
window.addEventListener('scCheckoutCompleted', function (e: CustomEvent) {
  if (!window?.fbq) return;

  const checkout = e.detail;

  window.fbq('track', 'Purchase', {
    content_ids: checkout?.items?.map(item => item.item_id),
    content_name: 'Purchase',
    content_type: 'product',
    contents: checkout?.items?.map(item => ({ id: item.item_id, quantity: item.quantity })),
    currency: checkout?.currency,
    num_items: checkout?.items?.length,
    value: maybeConvertAmount(checkout?.total_amount, checkout?.currency || 'USD'),
  });
});

/**
 * Handle trial started event.
 */
window.addEventListener('scTrialStarted', function (e: CustomEvent) {
  if (!window?.fbq) return;

  const items: LineItem[] = e.detail;

  items.forEach(item => {
    window.fbq('track', 'StartTrial', {
      currency: item.price?.currency,
      value: maybeConvertAmount(item?.price?.amount || 0, item.price?.currency || 'USD'), // Here we use the price amount instead of total amount because the total amount is 0 for trial subscriptions. But since the customer is committing to a subscription, we can use the price amount.
    });
  });
});

/**
 * Handle subscription started event.
 */
window.addEventListener('scSubscriptionStarted', function (e: CustomEvent) {
  if (!window?.fbq) return;

  const items: LineItem[] = e.detail;

  items.forEach(item => {
    window.fbq('track', 'Subscribe', {
      currency: item.price?.currency,
      value: maybeConvertAmount(item?.total_amount || 0, item.price?.currency || 'USD'), // Here we use the total amount instead of price amount because the total amount is the first payment amount which also contains setup fee. The price amount is the recurring amount.
    });
  });
});

/**
 * Handle payment info added event.
 */
window.addEventListener('scPaymentInfoAdded', function (e: CustomEvent) {
  if (!window?.fbq) return;

  const detail = e.detail;

  window.fbq('track', 'AddPaymentInfo', {
    content_category: 'Payment Info Added',
    currency: detail?.currency,
  });
});
