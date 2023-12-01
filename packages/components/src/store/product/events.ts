import { Product } from 'src/types';

/**
 * Product viewed event.
 */
export const productViewed = (product: Product) => {
  const event = new CustomEvent('scProductViewed', {
    detail: {
      id: product?.id,
      name: product?.name,
      permalink: product?.permalink,
      prices: product?.prices,
    },
    bubbles: true,
  });
  document.dispatchEvent(event);
};
