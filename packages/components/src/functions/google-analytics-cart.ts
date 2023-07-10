interface AnalyticsData {
  currency: string;
  value: number;
  items: {
    item_id: string,
    coupon?: string,
    discount?: string,
    item_name: string;
    price: number;
    quantity: number;
    //TODO: include things such as item_variant and item_category(collection)- Kiptoo 10/7/2023
  }[];
}

export function doCartGoogleAnalytics(data: AnalyticsData) {
  if (!window?.dataLayer && !window?.gtag) return;

  // handle google analytics script
  if (window?.gtag) {
    window.gtag('event', 'add_to_cart', data);
  }

  // handle datalayer
  if (window?.dataLayer) {
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: 'add_to_cart',
      ecommerce: {
        data: data
      },
    });
  }
}
