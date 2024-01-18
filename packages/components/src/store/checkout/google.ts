import { maybeConvertAmount } from '../../functions/currency';
import { Checkout, LineItem, Product, ShippingMethod } from 'src/types';

/**
 * Handle add to cart event.
 */
window.addEventListener('scAddedToCart', function (e: CustomEvent) {
  if (!window?.dataLayer && !window?.gtag) return;

  // get the added item from the event.
  const item: LineItem = e.detail;

  // sanity check.
  if (!item?.price?.product) return;

  // create the items array.
  const items = [
    {
      item_id: (item.price?.product as Product)?.id,
      item_name: (item.price?.product as Product)?.name,
      item_variant: (item.variant_options || []).join(' / '),
      price: maybeConvertAmount(item?.price?.amount || 0, item.price?.currency || 'USD'),
      currency: item.price?.currency,
      quantity: item.quantity,
      discount: item?.discount_amount ? maybeConvertAmount(item?.discount_amount || 0, item.price?.currency || 'USD') : 0,
    },
  ];

  // handle datalayer
  if (window?.dataLayer) {
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: 'add_to_cart',
      ecommerce: {
        data: {
          items,
        },
      },
    });
    return;
  }

  // handle google analytics script
  window.gtag('event', 'add_to_cart', {
    items,
  });
});

/**
 * Handle remove from cart event.
 */
window.addEventListener('scRemovedFromCart', function (e: CustomEvent) {
  if (!window?.dataLayer && !window?.gtag) return;

  // get the removed item from the event.
  const item: LineItem = e.detail;

  // sanity check.
  if (!item?.price?.product) return;

  const data = {
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
  };

  // handle datalayer
  if (window?.dataLayer) {
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: 'remove_from_cart',
      ecommerce: {
        data,
      },
    });
    return;
  }

  // handle google analytics script
  window.gtag('event', 'remove_from_cart', data);
});

/**
 * Handle view cart event.
 */
window.addEventListener('scViewedCart', function (e: CustomEvent) {
  if (!window?.dataLayer && !window?.gtag) return;

  const checkout: Checkout = e.detail;

  const data = {
    currency: checkout.currency,
    value: maybeConvertAmount(checkout.total_amount, checkout.currency),
    ...(checkout.discount?.promotion?.code ? { coupon: checkout.discount?.promotion?.code } : {}),
    items: (checkout.line_items?.data || []).map(item => ({
      item_id: (item?.price?.product as Product)?.id,
      item_name: (item?.price?.product as Product)?.name,
      currency: item.price?.currency,
      discount: item.discount_amount ? maybeConvertAmount(item.discount_amount, item.price?.currency) : 0,
      price: maybeConvertAmount(item?.price?.amount, item.price?.currency),
      quantity: item.quantity,
      ...(item?.variant_options?.length ? { item_variant: (item.variant_options || []).join(' / ') } : {}),
    })),
  };

  // handle dataLayer (google tag manager).
  if (window?.dataLayer) {
    window.dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
    window.dataLayer.push({
      event: 'view_cart',
      ecommerce: data,
    });
    return;
  }

  // handle gtag (analytics script.)
  window.gtag('event', 'view_cart', data);
});

/**
 * Handle checkout initiated event.
 */
window.addEventListener('scCheckoutInitiated', function (e: CustomEvent) {
  if (!window?.dataLayer && !window?.gtag) return;

  const checkout: Checkout = e.detail;

  const data = {
    currency: checkout.currency,
    value: maybeConvertAmount(checkout.total_amount, checkout.currency),
    ...(checkout?.discount?.promotion?.code ? { coupon: checkout?.discount?.promotion?.code } : {}),
    items: (checkout.line_items?.data || []).map(item => ({
      item_id: (item?.price?.product as Product)?.id,
      item_name: (item?.price?.product as Product)?.name,
      currency: item.price?.currency,
      discount: item.discount_amount ? maybeConvertAmount(item.discount_amount, item.price?.currency) : 0,
      price: maybeConvertAmount(item?.price?.amount, item.price?.currency),
      quantity: item.quantity,
      item_variant: (item.variant_options || []).join(' / '),
    })),
  };

  // handle dataLayer (google tag manager).
  if (window?.dataLayer) {
    window.dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
    window.dataLayer.push({
      event: 'begin_checkout',
      ecommerce: data,
    });
    return;
  }

  // handle gtag (analytics script.)
  window.gtag('event', 'begin_checkout', data);
});

/**
 * Handle purchase complete event.
 */
window.addEventListener('scCheckoutCompleted', function (e: CustomEvent) {
  if (!window?.dataLayer && !window?.gtag) return;

  const checkout = e.detail;

  const data = {
    transaction_id: checkout?.id,
    value: maybeConvertAmount(checkout?.total_amount, checkout?.currency || 'USD'),
    currency: (checkout.currency || '').toUpperCase(),
    ...(checkout?.discount?.promotion?.code ? { coupon: checkout?.discount?.promotion?.code } : {}),
    ...(checkout?.tax_amount ? { tax: maybeConvertAmount(checkout?.tax_amount, checkout?.currency || 'USD') } : {}),
    items: (checkout?.line_items?.data || []).map(item => ({
      item_id: (item?.price?.product as Product)?.id,
      currency: (checkout.currency || '').toUpperCase(),
      item_name: (item?.price?.product as Product)?.name || '',
      discount: item?.discount_amount ? maybeConvertAmount(item?.discount_amount || 0, item?.price?.currency || 'USD') : 0,
      price: maybeConvertAmount(item?.price?.amount || 0, item?.price?.currency || 'USD'),
      quantity: item?.quantity || 1,
      item_variant: (item.variant_options || []).join(' / '),
    })),
  };

  // handle dataLayer (google tag manager).
  if (window?.dataLayer) {
    window.dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
    window.dataLayer.push({
      event: 'purchase',
      ecommerce: data,
    });
    return;
  }

  // handle gtag (analytics script.)
  window.gtag('event', 'purchase', data);
});

/**
 * Handle payment info added event.
 */
window.addEventListener('scPaymentInfoAdded', function (e: CustomEvent) {
  if (!window?.dataLayer && !window?.gtag) return;

  const checkout = e.detail;

  const data = {
    currency: (checkout.currency || '').toUpperCase(),
    value: maybeConvertAmount(checkout?.total_amount, checkout?.currency || 'USD'),
    ...(checkout?.discount?.promotion?.code ? { coupon: checkout?.discount?.promotion?.code } : {}),
    items: (checkout?.line_items?.data || []).map(item => ({
      item_id: (item?.price?.product as Product)?.id,
      item_name: (item?.price?.product as Product)?.name || '',
      currency: (checkout.currency || '').toUpperCase(),
      discount: item?.discount_amount ? maybeConvertAmount(item?.discount_amount || 0, item?.price?.currency || 'USD') : 0,
      price: maybeConvertAmount(item?.price?.amount || 0, item?.price?.currency || 'USD'),
      quantity: item?.quantity || 1,
      item_variant: (item.variant_options || []).join(' / '),
    })),
  };

  // handle dataLayer (google tag manager).
  if (window?.dataLayer) {
    window.dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
    window.dataLayer.push({
      event: 'add_payment_info',
      ecommerce: data,
    });
    return;
  }

  // handle gtag (analytics script.)
  window.gtag('event', 'add_payment_info', data);
});

/**
 * Handle shipping info added event.
 */
window.addEventListener('scShippingInfoAdded', function (e: CustomEvent) {
  if (!window?.dataLayer && !window?.gtag) return;

  const checkout: Checkout = e.detail;
  const selectedShippingChoice = checkout?.shipping_choices?.data?.find(method => method.id === checkout?.selected_shipping_choice);
  const selectedShippingTier = (selectedShippingChoice?.shipping_method as ShippingMethod)?.name || '';

  const data = {
    currency: checkout.currency,
    value: maybeConvertAmount(checkout.total_amount, checkout.currency),
    ...(checkout?.discount?.promotion?.code ? { coupon: checkout?.discount?.promotion?.code } : {}),
    ...(!!selectedShippingTier ? { shipping_tier: selectedShippingTier } : {}),
    items: (checkout.line_items?.data || []).map(item => ({
      item_id: (item?.price?.product as Product)?.id,
      item_name: (item?.price?.product as Product)?.name || '',
      currency: item.price?.currency,
      discount: item.discount_amount ? maybeConvertAmount(item.discount_amount, item.price?.currency) : 0,
      price: maybeConvertAmount(item?.price?.amount, item.price?.currency),
      quantity: item.quantity,
      item_variant: (item.variant_options || []).join(' / '),
    })),
  };

  // handle dataLayer (google tag manager).
  if (window?.dataLayer) {
    window.dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
    window.dataLayer.push({
      event: 'add_shipping_info',
      ecommerce: data,
    });
    return;
  }

  // handle gtag (analytics script.)
  window.gtag('event', 'add_shipping_info', data);
});
