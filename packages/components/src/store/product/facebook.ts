import { maybeConvertAmount } from '../../functions/currency';
import { ProductsSearchedParams } from 'src/types';

/**
 * Handle search event.
 */
window.addEventListener('scSearched', function (e: CustomEvent) {
  if (!window?.fbq) return;

  const eventDetail: ProductsSearchedParams = e.detail;

  window.fbq('track', 'Search', {
    search_string: eventDetail.searchString,
    content_ids: eventDetail.searchResultIds,
    ...(!!eventDetail?.searchCollections?.length ? { content_category: eventDetail.searchCollections.join(',') } : {}),
  });
});

/**
 * Handle view content event.
 */
window.addEventListener('scProductViewed', function (e: CustomEvent) {
  if (!window?.fbq) return;

  const product = e.detail;

  window.fbq('track', 'ViewContent', {
    content_ids: [product.id],
    content_category: product?.product_collections?.data?.map(collection => collection.name).join(', '),
    content_name: product?.name + (product?.variant_options?.length ? ` - ${product?.variant_options.join(' / ')}` : ''),
    content_type: 'product',
    contents: [
      {
        id: product.id,
        quantity: 1,
      },
    ],
    currency: product?.price?.currency,
    value: maybeConvertAmount(product.price?.amount || 0, product.price?.currency || 'USD'),
  });
});
