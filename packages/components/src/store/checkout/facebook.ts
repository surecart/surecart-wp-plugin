import { maybeConvertAmount } from '../../functions/currency';
import { Checkout, LineItem, Product } from 'src/types';

/**
 * Facebook (Meta) Pixel standard events for the checkout flow.
 *
 * @see https://developers.facebook.com/docs/meta-pixel/reference Standard event names & expected payloads.
 * @see https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#object-properties Payload properties (content_ids, contents, value, currency).
 * @see https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events eventID-based Pixel ↔ Conversions API deduplication.
 */

const isTrackingDisabled = () => !window?.fbq || window?.scData?.facebook_tracking_enabled === false;

/**
 * Handle add to cart event.
 */
window.addEventListener('scAddedToCart', function (e: CustomEvent) {
  if (isTrackingDisabled()) return;

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
  if (isTrackingDisabled()) return;

  const checkout: Checkout = e.detail;

  window.fbq(
    'track',
    'InitiateCheckout',
    {
      content_ids: (checkout?.line_items.data || [])?.map(item => item.id),
      contents: (checkout?.line_items.data || [])?.map(item => ({ id: item.id, quantity: item.quantity })),
      currency: checkout?.currency,
      num_items: checkout?.line_items?.data?.length || 0,
      value: maybeConvertAmount(checkout?.total_amount, checkout?.currency || 'USD'),
    },
    { eventID: checkout?.id },
  );
});

/**
 * Handle purchase complete event.
 */
window.addEventListener('scCheckoutCompleted', function (e: CustomEvent) {
  if (isTrackingDisabled()) return;

  const checkout: Checkout = e.detail;
  const lineItems = checkout?.line_items?.data || [];

  window.fbq(
    'track',
    'Purchase',
    {
      content_ids: lineItems.map(item => (item?.price?.product as Product)?.id),
      content_name: 'Purchase',
      content_type: 'product',
      contents: lineItems.map(item => ({ id: (item?.price?.product as Product)?.id, quantity: item.quantity })),
      currency: checkout?.currency,
      num_items: lineItems.length,
      value: maybeConvertAmount(checkout?.total_amount, checkout?.currency || 'USD'),
    },
    { eventID: checkout?.id },
  );
});

/**
 * Handle trial started event.
 */
window.addEventListener('scTrialStarted', function (e: CustomEvent) {
  if (isTrackingDisabled()) return;

  const items: LineItem[] = e.detail;

  items.forEach(item => {
    window.fbq(
      'track',
      'StartTrial',
      {
        currency: item.price?.currency,
        value: maybeConvertAmount(item.price?.amount || 0, item.price?.currency || 'USD'),
      },
      { eventID: item?.id },
    );
  });
});

/**
 * Handle subscription started event.
 */
window.addEventListener('scSubscriptionStarted', function (e: CustomEvent) {
  if (isTrackingDisabled()) return;

  const items: LineItem[] = e.detail;

  items.forEach(item => {
    window.fbq(
      'track',
      'Subscribe',
      {
        currency: item.price?.currency,
        value: maybeConvertAmount(item.price?.amount || 0, item.price?.currency || 'USD'),
      },
      { eventID: item?.id },
    );
  });
});

/**
 * Handle payment info added event.
 */
window.addEventListener('scPaymentInfoAdded', function (e: CustomEvent) {
  if (isTrackingDisabled()) return;

  const detail = e.detail;

  window.fbq('track', 'AddPaymentInfo', {
    content_category: 'Payment Info Added',
    currency: detail?.currency,
  });
});
