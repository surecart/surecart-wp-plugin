import { maybeConvertAmount } from 'src/functions/currency';
import { ProductsViewedParams } from 'src/types';
import { __ } from '@wordpress/i18n';
import { trackEvent } from 'src/functions/google';
/**
 * Handle the search event.
 */

window.addEventListener('scSearched', (e: CustomEvent) => {
  trackEvent('search', {
    search_term: e.detail?.searchString,
  });
});

/**
 * Handle view item event.
 */
window.addEventListener('scProductViewed', (e: CustomEvent) => {
  const product = e.detail;
  trackEvent('view_item', {
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
  });
});

/**
 * Handle view items event.
 */
window.addEventListener('scProductsViewed', (e: CustomEvent) => {
  const eventDetail: ProductsViewedParams = e.detail;
  trackEvent('view_item_list', {
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
  });
});
