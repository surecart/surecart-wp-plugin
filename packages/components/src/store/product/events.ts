import { Price, Product } from 'src/types';

/**
 * Product viewed event.
 */
export const productViewed = (product: Product,selectedPrice: Price) => {
  const event = new CustomEvent('scProductViewed', {
    detail: {
      id: product?.id,
      name: product?.name,
      price: selectedPrice,
      permalink: product?.permalink,
      prices: product?.prices,
      variant_options: product?.variant_options,
      product_collections: product?.product_collections,
    },
    bubbles: true,
  });
  document.dispatchEvent(event);
};
