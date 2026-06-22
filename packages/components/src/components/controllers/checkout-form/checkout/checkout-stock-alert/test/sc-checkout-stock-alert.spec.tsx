import { newSpecPage } from '@stencil/core/testing';
import { dispose as disposeCheckout } from '@store/checkout';
import { ScCheckoutStockAlert } from '../sc-checkout-stock-alert';
import { buildStockAdjustedLineItems, buildStockAlertRows, getBundleComponentVariants, getBundleQuantityReductions } from '../../../../../../functions/stock';

/**
 * Build line items for a bundle parent and one stock-limited component.
 *
 * @param parentQty       Bundle quantity.
 * @param componentQty    Component total quantity (per-bundle × parentQty).
 * @param availableStock  Stock available for the component.
 */
const bundleLineItems = (parentQty: number, componentQty: number, availableStock: number) =>
  [
    {
      id: 'parent',
      quantity: parentQty,
      component_line_item: false,
      image: { src: 'kit.jpg' },
      price: { id: 'price_parent', product: { name: 'Camping Kit', bundle: true } },
    },
    {
      id: 'comp',
      quantity: componentQty,
      purchasable_status: 'out_of_stock',
      component_line_item: true,
      bundle_line_item: 'parent',
      variant_display_options: '2-Person',
      price: { id: 'price_comp', product: { name: 'Trail Tent', available_stock: availableStock } },
    },
  ] as any;

describe('stock', () => {
  describe('getBundleQuantityReductions', () => {
    it('caps the bundle at floor(stock / perBundleQty) instead of touching the component', () => {
      // 2 bundles × 1 tent each, only 1 tent in stock -> 1 bundle.
      expect(getBundleQuantityReductions(bundleLineItems(2, 2, 1)).get('parent')).toBe(1);
    });

    it('reduces the bundle to 0 when not even one bundle can be fulfilled', () => {
      // Bundle needs 2 tents per bundle but only 1 is in stock -> 0 bundles.
      expect(getBundleQuantityReductions(bundleLineItems(2, 4, 1)).get('parent')).toBe(0);
    });
  });

  describe('buildStockAdjustedLineItems', () => {
    it('posts the parent only (no component line items) with the reduced quantity', () => {
      expect(buildStockAdjustedLineItems(bundleLineItems(2, 2, 1))).toEqual([{ id: 'parent', price_id: 'price_parent', quantity: 1 }]);
    });

    it('adjusts a standalone out-of-stock item to its available stock', () => {
      const items = [
        { id: 'a', quantity: 5, purchasable_status: 'out_of_stock', price: { id: 'price_a', product: { name: 'Mug', available_stock: 2 } } },
      ] as any;
      expect(buildStockAdjustedLineItems(items)).toEqual([{ id: 'a', price_id: 'price_a', quantity: 2 }]);
    });

    it('still caps the bundle by another short component when one component is swapped', () => {
      // 5 bundles. Component A (gone variant) is swapped; component B only has 3
      // in stock (1 per bundle) -> bundle must drop to 3, not stay at 5.
      const items = [
        { id: 'parent', quantity: 5, component_line_item: false, price: { id: 'price_parent', product: { name: 'Kit', bundle: true } } },
        { id: 'a', quantity: 5, purchasable_status: 'out_of_stock', component_line_item: true, bundle_line_item: 'parent', price: { product: { id: 'pA', available_stock: 0 } } },
        { id: 'b', quantity: 5, purchasable_status: 'out_of_stock', component_line_item: true, bundle_line_item: 'parent', price: { product: { id: 'pB', available_stock: 3 } } },
      ] as any;
      const overrides = new Map([['parent', { pA: 'variant-blue' }]]);

      expect(buildStockAdjustedLineItems(items, overrides)).toEqual([{ id: 'parent', price_id: 'price_parent', quantity: 3, bundle_component_variants: { pA: 'variant-blue' } }]);
    });
  });

  describe('getBundleComponentVariants', () => {
    it('rebuilds the selection map from component line items, ignoring the empty parent field', () => {
      const items = [
        { id: 'parent', component_line_item: false, bundle_component_variants: [], price: { product: { name: 'Kit', bundle: true } } },
        { id: 'c1', component_line_item: true, bundle_line_item: 'parent', variant: { id: 'v-tent' }, price: { product: { id: 'p-tent' } } },
        { id: 'c2', component_line_item: true, bundle_line_item: 'parent', variant: { id: 'v-bag' }, price: { product: { id: 'p-bag' } } },
        { id: 'c3', component_line_item: true, bundle_line_item: 'parent', price: { product: { id: 'p-lantern' } } }, // no variant -> skipped
      ] as any;
      expect(getBundleComponentVariants('parent', items)).toEqual({ 'p-tent': 'v-tent', 'p-bag': 'v-bag' });
    });

    it('returns an empty map for a parent with no components', () => {
      expect(getBundleComponentVariants('parent', [])).toEqual({});
    });
  });

  describe('buildStockAlertRows', () => {
    it('shows the bundle row (parent quantity change), not the component', () => {
      expect(buildStockAlertRows(bundleLineItems(2, 2, 1))).toEqual([
        { name: 'Camping Kit', variant: undefined, image: { src: 'kit.jpg' }, from: 2, to: 1 },
      ]);
    });
  });

  describe('sc-checkout-stock-alert', () => {
    beforeEach(() => disposeCheckout());

    it('renders with no dialog open when there are no stock issues', async () => {
      const page = await newSpecPage({
        components: [ScCheckoutStockAlert],
        html: `<sc-checkout-stock-alert></sc-checkout-stock-alert>`,
      });
      expect(page.root?.shadowRoot?.querySelector('sc-dialog')?.getAttribute('open')).toBeFalsy();
    });
  });
});
