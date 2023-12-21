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
  // content_category, content_ids, contents, currency, num_items, value
  window.fbq('track', 'InitiateCheckout', {
    content_ids: (checkout?.line_items?.data || []).map(item => (item?.price?.product as Product)?.id),
    content_type: 'product',
    currency: checkout?.currency,
    value: maybeConvertAmount(checkout?.total_amount, checkout?.currency || 'USD'),
    num_items: (checkout?.line_items?.data || []).reduce((total, item) => total + item.quantity, 0),
  });
});
