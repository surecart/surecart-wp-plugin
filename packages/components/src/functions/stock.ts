import { ImageAttributes, LineItem, LineItemData, Price, Product } from '../types';
import { getPerBundleQuantity } from './line-items';

export interface StockAlertRow {
  name?: string;
  variant?: string;
  image?: ImageAttributes;
  from: number;
  to: number;
}

/** Available stock for a line item (variant takes precedence over product). */
export const getAvailableStock = (lineItem: LineItem): number => {
  const product = lineItem?.price?.product as Product;
  const stock = lineItem?.variant?.id ? lineItem?.variant?.available_stock : product?.available_stock;
  return Math.max(Number(stock) || 0, 0);
};

/** Out-of-stock line items (standalone items and bundle components). */
export const getOutOfStockLineItems = (lineItems: LineItem[] = []): LineItem[] =>
  (lineItems || []).filter(lineItem => lineItem?.purchasable_status === 'out_of_stock' && getAvailableStock(lineItem) < lineItem.quantity);

/**
 * A bundle is atomic, so a short component caps the bundle, not the component:
 * floor(stock / perBundleQty), smallest cap across components. Returns a map of
 * bundle parent id -> reduced quantity.
 *
 * `swappedProductsByParent` lists component products being swapped to an in-stock
 * variant — those are skipped so they don't cap a bundle they no longer limit.
 */
export const getBundleQuantityReductions = (lineItems: LineItem[] = [], swappedProductsByParent: Map<string, Set<string>> = new Map()): Map<string, number> => {
  const reductions = new Map<string, number>();

  getOutOfStockLineItems(lineItems).forEach(component => {
    if (!component.component_line_item || !component.bundle_line_item) return;
    const parent = (lineItems || []).find(li => li.id === component.bundle_line_item);
    if (!parent?.id) return;

    // Skip a component that's being swapped — its old stock no longer caps the bundle.
    const productId = ((component.price as Price)?.product as Product)?.id;
    if (productId && swappedProductsByParent.get(parent.id)?.has(productId)) return;

    const perBundle = getPerBundleQuantity(component, parent.quantity);
    const maxBundles = Math.floor(getAvailableStock(component) / perBundle);

    const current = reductions.get(parent.id) ?? parent.quantity;
    reductions.set(parent.id, Math.max(Math.min(current, maxBundles), 0));
  });

  return reductions;
};

/**
 * Payload to fix a stock alert. Posts parents only (components derive from the
 * parent): bundles drop to their reduced quantity, standalone items to available
 * stock. A swapped component is excluded from its bundle's cap, so any *other*
 * short component still reduces the bundle correctly.
 */
export const buildStockAdjustedLineItems = (lineItems: LineItem[] = [], bundleVariantOverrides: Map<string, Record<string, string>> = new Map()): LineItemData[] => {
  // Component products being swapped, keyed by bundle parent.
  const swappedProductsByParent = new Map<string, Set<string>>(Array.from(bundleVariantOverrides, ([parentId, map]) => [parentId, new Set(Object.keys(map))]));
  const reductions = getBundleQuantityReductions(lineItems, swappedProductsByParent);

  const standalone = new Map<string, number>();
  getOutOfStockLineItems(lineItems).forEach(lineItem => {
    if (lineItem.component_line_item || !lineItem.id) return;
    standalone.set(lineItem.id, getAvailableStock(lineItem));
  });

  return (lineItems || [])
    .filter(lineItem => !lineItem.component_line_item)
    .map(lineItem => {
      const id = lineItem.id;
      const hasSwap = !!id && bundleVariantOverrides.has(id);
      let quantity = lineItem.quantity;
      if (id && reductions.has(id)) quantity = reductions.get(id) ?? quantity;
      else if (id && standalone.has(id)) quantity = standalone.get(id) ?? quantity;

      return {
        id,
        price_id: (lineItem.price as Price)?.id,
        quantity,
        ...(lineItem?.variant?.id ? { variant: lineItem.variant.id } : {}),
        ...(id && hasSwap ? { bundle_component_variants: bundleVariantOverrides.get(id) } : {}),
      };
    });
};

/**
 * Rows for the stock alert dialog. Bundle components roll up into a single
 * parent row (the bundle quantity is what changes); standalone items show
 * themselves.
 */
export const buildStockAlertRows = (lineItems: LineItem[] = []): StockAlertRow[] => {
  const reductions = getBundleQuantityReductions(lineItems);
  const seenParents = new Set<string>();
  const rows: StockAlertRow[] = [];

  getOutOfStockLineItems(lineItems).forEach(lineItem => {
    if (lineItem.component_line_item && lineItem.bundle_line_item) {
      const parent = (lineItems || []).find(li => li.id === lineItem.bundle_line_item);
      if (!parent?.id || seenParents.has(parent.id)) return;
      seenParents.add(parent.id);
      const product = parent.price?.product as Product;
      rows.push({
        name: product?.name,
        variant: parent?.variant_display_options,
        image: parent?.image,
        from: parent.quantity,
        to: Math.max(reductions.get(parent.id) ?? parent.quantity, 0),
      });
      return;
    }

    const product = lineItem.price?.product as Product;
    rows.push({
      name: product?.name,
      variant: lineItem?.variant_display_options,
      image: lineItem?.image,
      from: lineItem.quantity,
      to: getAvailableStock(lineItem),
    });
  });

  return rows;
};
