import { Product } from 'src/types';
import { on } from './store';

/**
 * Purchase complete event.
 */
on('set', (key, product: Product, oldProduct: Product) => {
  if (key !== 'product') return; // we only care about product
  if (oldProduct?.id) return; // we only care about new product views.

  // emit the new event.
  const event = new CustomEvent('scProductViewed', {
    detail: {
      id: product?.id,
      name: product?.name,
      permalink: product?.permalink,
      prices: product?.prices,
    },
  });

  window.dispatchEvent(event);
});
