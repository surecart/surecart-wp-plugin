import { maybeConvertAmount } from 'src/functions/currency';
import { ProductsSearchedParams, ProductsViewedParams } from 'src/types';
import { __ } from '@wordpress/i18n';
/**
 * Handle the search event.
 */
window.addEventListener('scSearched', function (e: CustomEvent) {
  if (!window?.dataLayer && !window?.gtag) return;

  const eventDetail: ProductsSearchedParams = e.detail;

  // handle datalayer
  if (window?.dataLayer) {
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: 'search',
      ecommerce: {
        search_term: eventDetail?.searchString,
      },
    });
    return;
  }

  // handle google analytics script
  window.gtag('event', 'search', {
    search_term: eventDetail?.searchString,
  });
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
        quantity: product?.quantity || 1,
        ...(product?.variant_options?.length ? { item_variant: product?.variant_options.map(option => option.name).join(' / ') } : {}),
        ...(product?.product_collections?.data?.length ? { item_category: product?.product_collections?.data?.map(collection => collection.name).join(', ') } : {}),
      },
    ],
  };

  // handle datalayer
  if (window?.dataLayer) {
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: 'view_item',
      ecommerce: data,
    });
    return;
  }

  // handle google analytics script
  window.gtag('event', 'view_item', data);
});

/**
 * Handle view items event.
 */
window.addEventListener('scProductsViewed', function (e: CustomEvent) {
  if (!window?.dataLayer && !window?.gtag) return;

  const eventDetail: ProductsViewedParams = e.detail;

  const data = {
    item_list_id: `${eventDetail?.collectionId}-page-${eventDetail?.currentPage}`,
    item_list_name: `${eventDetail?.pageTitle} - Page ${eventDetail?.currentPage}`,
    page_number: eventDetail?.currentPage,
    items: eventDetail?.products?.map(product => ({
      item_id: product?.id,
      item_name: product?.name,
      ...(product?.product_collections?.data?.length ? { item_category: product?.product_collections?.data?.map(collection => collection.name).join(', ') } : {}),
      item_list_id: `${eventDetail?.collectionId}-page-${eventDetail?.currentPage}`,
      item_list_name: `${eventDetail?.pageTitle} - Page ${eventDetail?.currentPage}`,
    })),
  };

  // handle datalayer
  if (window?.dataLayer) {
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: 'view_item_list',
      ecommerce: data,
    });
    return;
  }

  // handle google analytics script
  window.gtag('event', 'view_item_list', data);
});
