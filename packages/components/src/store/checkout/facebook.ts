import { maybeConvertAmount } from 'src/functions/currency';
import { LineItem, Product } from 'src/types';

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
    value: maybeConvertAmount(item?.price?.amount || 0, item?.price?.currency || 'USD'),
  });
});

/**
 * Handle purchase initiated event.
 */
window.addEventListener('scCheckoutInitiated', function (e: CustomEvent) {
  if (!window?.fbq) return;

  const checkout = e.detail;

  window.fbq('track', 'InitiateCheckout', {
    content_category: checkout?.items?.map(item => item.item_collections).join(', '),
    content_ids: checkout?.items?.map(item => item.item_id),
    contents: checkout?.items?.map(item => ({ id: item.item_id, quantity: item.quantity })),
    currency: checkout?.currency,
    num_items: checkout?.items?.length,
    value: maybeConvertAmount(checkout?.value, checkout?.currency || 'USD'),
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
    value: maybeConvertAmount(checkout?.value, checkout?.currency || 'USD'),
  });
});
