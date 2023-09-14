import { CartGoogleAnalyticsItem } from 'src/types';

export function doCartGoogleAnalytics(items: CartGoogleAnalyticsItem[]) {
  if (!window?.dataLayer && !window?.gtag) return;

  // handle google analytics script
  if (window?.gtag) {
    window.gtag('event', 'add_to_cart', {
      items: items,
    });
  }

  // handle datalayer
  if (window?.dataLayer) {
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: 'add_to_cart',
      ecommerce: {
        data: {
          items: items,
        },
      },
    });
  }
}
