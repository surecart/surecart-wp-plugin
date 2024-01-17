import { maybeConvertAmount } from 'src/functions/currency';
import { ProductsSearchedParams } from 'src/types';

/**
 * Handle the search event.
 */
window.addEventListener('scSearched', function (e: CustomEvent) {
  if (!window?.dataLayer && !window?.gtag) return;

  const eventDetail: ProductsSearchedParams = e.detail;

  // handle google analytics script
  if (window?.gtag) {
    window.gtag('event', 'search', {
      search_term: eventDetail?.searchString,
    });
  }

  // handle datalayer
  if (window?.dataLayer) {
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: 'search',
      ecommerce: {
        search_term: eventDetail?.searchString,
      },
    });
  }
});

/**
 * Handle view item event.
 */
window.addEventListener('scProductViewed', function (e: CustomEvent) {
  if (!window?.dataLayer && !window?.gtag) return;

  const product = e.detail;
  const data = {
    value: maybeConvertAmount(product.price?.amount || 0, product.price?.currency || 'USD'),
    currency: product.price?.currency,
    items: [
      {
        item_id: product?.id,
        item_name: product?.name,
        currency: product?.price?.currency,
        discount: product?.discount_amount ? maybeConvertAmount(product?.discount_amount, product?.price?.currency) : 0,
        price: maybeConvertAmount(product?.price?.amount, product?.price?.currency),
        quantity: product?.quantity,
        item_variant: (product?.variant_options || []).join(' / '),
        ...(product?.product_collections?.data?.length ? { item_category: product?.product_collections?.data?.map(collection => collection.name).join(', ') } : {}),
      },
    ],
  };

  // handle google analytics script
  if (window?.gtag) {
    window.gtag('event', 'view_item', data);
  }

  // handle datalayer
  if (window?.dataLayer) {
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: 'view_item',
      ecommerce: data,
    });
  }
});
