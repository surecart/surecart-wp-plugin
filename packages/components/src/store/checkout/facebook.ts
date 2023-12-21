import { maybeConvertAmount } from "src/functions/currency";
import { LineItem, Product } from "src/types";

/**
 * Handle add to cart event.
 */
window.addEventListener('scAddedToCart', function (e: CustomEvent) {
  if (!window?.fbq) return;

  // get the added item from the event.
  const item: LineItem = e.detail;

  // sanity check.
  if (!item?.price?.product) return;

  window.fbq('track', 'AddToCart', {
    content_ids: (item.price?.product as Product)?.id,
    content_name: (item.price?.product as Product)?.name,
    content_type: 'product',
    currency: item.price?.currency,
    value: maybeConvertAmount(item?.price?.amount || 0, item.price?.currency || 'USD'),
    num_items: item.quantity,
  });
 });
