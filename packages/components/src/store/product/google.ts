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
