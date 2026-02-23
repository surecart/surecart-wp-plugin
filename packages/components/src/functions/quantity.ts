import { Product, Variant } from 'src/types';

export function getMaxStockQuantity(product: Product, selectedVariant?: Variant): number | null {
  // Check purchase limit.
  if (product?.purchase_limit) {
    return product?.purchase_limit;
  }

  // If stock is not tracked, no max applies.
  const hasUnlimitedStock = selectedVariant ? selectedVariant.has_unlimited_stock ?? product?.has_unlimited_stock : product?.has_unlimited_stock;
  if (hasUnlimitedStock) {
    return null;
  }

  // If no variant is selected, check against product stock.
  if (!selectedVariant) return product?.available_stock;

  // Check against selected variant's stock.
  return selectedVariant?.available_stock;
}
