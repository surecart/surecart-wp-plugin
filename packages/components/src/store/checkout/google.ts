import { trackEvent } from '../../functions/google';
import { maybeConvertAmount } from '../../functions/currency';
import { Checkout, LineItem, Product, ShippingMethod } from 'src/types';

/**
 * Handle add to cart event.
 */
window.addEventListener('scAddedToCart', (e: CustomEvent) => {
  const item: LineItem = e.detail;

  // sanity check.
  if (!item?.price?.product) return;

  trackEvent('add_to_cart', {
    currency: item.price?.currency,
    value: maybeConvertAmount(item?.price?.amount || 0, item.price?.currency || 'USD'),
    items: [
      {
        item_id: (item.price?.product as Product)?.id,
        item_name: (item.price?.product as Product)?.name,
        item_variant: (item.variant_options || []).join(' / '),
        price: maybeConvertAmount(item?.price?.amount || 0, item.price?.currency || 'USD'),
        currency: item.price?.currency,
        quantity: item.quantity,
        discount: item?.discount_amount ? maybeConvertAmount(item?.discount_amount || 0, item.price?.currency || 'USD') : 0,
      },
    ],
  });
});

/**
 * Handle remove from cart event.
 */
window.addEventListener('scRemovedFromCart', (e: CustomEvent) => {
  const item: LineItem = e.detail;

  // sanity check.
  if (!item?.price?.product) return;

  trackEvent('remove_from_cart', {
    currency: item.price?.currency,
    value: maybeConvertAmount(item?.price?.amount || 0, item.price?.currency || 'USD'),
    items: [
      {
        item_id: (item.price?.product as Product)?.id,
        item_name: (item.price?.product as Product)?.name,
        item_variant: (item.variant_options || []).join(' / '),
        price: maybeConvertAmount(item?.price?.amount || 0, item.price?.currency || 'USD'),
        currency: item.price?.currency,
        quantity: item.quantity,
        discount: item?.discount_amount ? maybeConvertAmount(item?.discount_amount || 0, item.price?.currency || 'USD') : 0,
      },
    ],
  });
});

/**
 * Handle view cart event.
 */
window.addEventListener('scViewedCart', (e: CustomEvent) => {
  const checkout: Checkout = e.detail;

  trackEvent('view_cart', {
    currency: checkout.currency,
    value: maybeConvertAmount(checkout.total_amount, checkout.currency),
    items: (checkout.line_items?.data || []).map(item => ({
      item_id: (item?.price?.product as Product)?.id,
      item_name: (item?.price?.product as Product)?.name,
      currency: item.price?.currency,
      discount: item.discount_amount ? maybeConvertAmount(item.discount_amount, item.price?.currency) : 0,
      price: maybeConvertAmount(item?.total_amount, item.price?.currency),
      quantity: item.quantity,
      ...(item?.variant_options?.length ? { item_variant: (item.variant_options || []).join(' / ') } : {}),
    })),
  });
});

/**
 * Handle checkout initiated event.
 */
window.addEventListener('scCheckoutInitiated', (e: CustomEvent) => {
  const checkout: Checkout = e.detail;

  trackEvent('begin_checkout', {
    currency: checkout.currency,
    value: maybeConvertAmount(checkout.total_amount, checkout.currency),
    items: (checkout.line_items?.data || []).map(item => ({
      item_id: (item?.price?.product as Product)?.id,
      item_name: (item?.price?.product as Product)?.name,
      currency: item.price?.currency,
      discount: item.discount_amount ? maybeConvertAmount(item.discount_amount, item.price?.currency) : 0,
      price: maybeConvertAmount(item?.total_amount, item.price?.currency),
      quantity: item.quantity,
      ...(item?.variant_options?.length ? { item_variant: (item.variant_options || []).join(' / ') } : {}),
    })),
  });
});

/**
 * Handle purchase complete event.
 */
window.addEventListener('scCheckoutCompleted', (e: CustomEvent) => {
  const checkout: Checkout = e.detail;

  trackEvent('purchase', {
    transaction_id: checkout?.id,
    value: maybeConvertAmount(checkout?.total_amount, checkout?.currency || 'USD'),
    currency: (checkout.currency || '').toUpperCase(),
    items: (checkout?.line_items?.data || []).map(item => ({
      item_id: (item?.price?.product as Product)?.id,
      currency: (checkout.currency || '').toUpperCase(),
      item_name: (item?.price?.product as Product)?.name || '',
      discount: item?.discount_amount ? maybeConvertAmount(item?.discount_amount || 0, item?.price?.currency || 'USD') : 0,
      price: maybeConvertAmount(item?.total_amount || 0, item?.price?.currency || 'USD'),
      quantity: item?.quantity || 1,
      ...(item?.variant_options?.length ? { item_variant: (item.variant_options || []).join(' / ') } : {}),
    })),
  });
});

/**
 * Handle payment info added event.
 */
window.addEventListener('scPaymentInfoAdded', (e: CustomEvent) => {
  const checkout = e.detail;

  trackEvent('add_payment_info', {
    currency: checkout.currency,
    value: maybeConvertAmount(checkout.total_amount, checkout.currency),
    items: (checkout.line_items?.data || []).map(item => ({
      item_id: (item?.price?.product as Product)?.id,
      item_name: (item?.price?.product as Product)?.name || '',
      currency: item.price?.currency,
      discount: item.discount_amount ? maybeConvertAmount(item.discount_amount, item.price?.currency) : 0,
      price: maybeConvertAmount(item?.total_amount, item.price?.currency),
      quantity: item.quantity,
      ...(item?.variant_options?.length ? { item_variant: (item.variant_options || []).join(' / ') } : {}),
    })),
  });
});

/**
 * Handle shipping info added event.
 */
window.addEventListener('scShippingInfoAdded', (e: CustomEvent) => {
  const checkout: Checkout = e.detail;
  const selectedShippingChoice = checkout?.shipping_choices?.data?.find(method => method.id === checkout?.selected_shipping_choice);
  const selectedShippingTier = (selectedShippingChoice?.shipping_method as ShippingMethod)?.name || '';

  trackEvent('add_shipping_info', {
    currency: checkout.currency,
    value: maybeConvertAmount(checkout.total_amount, checkout.currency),
    ...(checkout?.discount?.promotion?.code ? { coupon: checkout?.discount?.promotion?.code } : {}),
    ...(selectedShippingTier ? { shipping_tier: selectedShippingTier } : ''),
    items: (checkout.line_items?.data || []).map(item => ({
      item_id: (item?.price?.product as Product)?.id,
      item_name: (item?.price?.product as Product)?.name || '',
      currency: item.price?.currency,
      discount: item.discount_amount ? maybeConvertAmount(item.discount_amount, item.price?.currency) : 0,
      price: maybeConvertAmount(item?.total_amount, item.price?.currency),
      quantity: item.quantity,
      ...(item?.variant_options?.length ? { item_variant: (item.variant_options || []).join(' / ') } : {}),
    })),
  });
});
