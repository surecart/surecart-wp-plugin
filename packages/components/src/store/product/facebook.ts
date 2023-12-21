import { ProductsSearchedParams } from 'src/types';

/**
 * Handle search event.
 */
window.addEventListener('scSearched', function (e: CustomEvent) {
  if (!window?.fbq) return;

  const eventDetail: ProductsSearchedParams = e.detail;

  window.fbq('track', 'Search', {
    search_string: eventDetail.search_string,
    content_ids: eventDetail.search_result_ids,
    content_category: eventDetail.search_collection,
    ...(!!eventDetail.search_collection ? { content_category: eventDetail.search_collection } : {}),
  });
});
