import { maybeConvertAmount } from '../../functions/currency';
import { LineItem, Product } from 'src/types';

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

  // handle google analytics script
  if (window?.gtag) {
    window.gtag('event', 'add_to_cart', {
      items,
    });
  }

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
  }
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

  // handle gtag (analytics script.)
  if (window?.gtag) {
    window.gtag('event', 'purchase', data);
  }

  // handle dataLayer (google tag manager).
  if (window?.dataLayer) {
    window.dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
    window.dataLayer.push({
      event: 'purchase',
      ecommerce: data,
    });
  }
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

  // handle gtag (analytics script.)
  if (window?.gtag) {
    window.gtag('event', 'add_payment_info', data);
  }

  // handle dataLayer (google tag manager).
  if (window?.dataLayer) {
    window.dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
    window.dataLayer.push({
      event: 'add_payment_info',
      ecommerce: data,
    });
  }
});

/**
 * Handle shipping info added event.
 */
window.addEventListener('scShippingInfoAdded', function (e: CustomEvent) {
  if (!window?.dataLayer && !window?.gtag) return;

  const eventDetail = e.detail;

  const data = {
    currency: eventDetail.currency,
    value: eventDetail.value,
    ...(eventDetail?.coupon ? { coupon: eventDetail?.coupon } : {}),
    ...((eventDetail?.shipping_tier) ? { shipping_tier: eventDetail?.shipping_tier } : {}),
    items: eventDetail.items.map(item => ({
      item_id: item.item_id,
      item_name: item.item_name,
      currency: item.currency,
      discount: item.discount,
      price: item.price,
      quantity: item.quantity,
      item_variant: item.item_variant,
    })),
  };

  // handle gtag (analytics script.)
  if (window?.gtag) {
    window.gtag('event', 'add_shipping_info', data);
  }

  // handle dataLayer (google tag manager).
  if (window?.dataLayer) {
    window.dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
    window.dataLayer.push({
      event: 'add_shipping_info',
      ecommerce: data,
    });
  }
});
