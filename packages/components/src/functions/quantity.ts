import { Product, Variant } from 'src/types';

export function getMaxStockQuantity(product: Product, selectedVariant?: Variant): number | null {
  // Check purchase limit.
  if (product?.purchase_limit) {
    return product?.purchase_limit;
  }

  // Check if stock needs to be checked
  const isStockNeedsToBeChecked = !!(product?.stock_enabled && !product?.allow_out_of_stock_purchases);

  // If stock is not enabled, return null
  if (!isStockNeedsToBeChecked) {
    return null;
  }

  // If no variant is selected, check against product stock.
  if (!selectedVariant) return product?.available_stock;

  // Check against selected variant's stock.
  return selectedVariant?.available_stock;
}
