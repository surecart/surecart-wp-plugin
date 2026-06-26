import { calculateInitialLineItems, getSessionId, getPerBundleQuantity, getBundleComponentRowsFromLineItems, groupBundleLineItems } from '../index';

const prices = [
  {
    id: 'price1',
    product_id: 'product1',
    quantity: 1,
    enabled: true,
  },
  {
    id: 'price2',
    product_id: 'product1',
    quantity: 2,
    enabled: true,
  },
  {
    id: 'price3',
    product_id: 'product2',
    quantity: 3,
    enabled: true,
  },
  {
    id: 'price4',
    product_id: 'product2',
    quantity: 4,
    enabled: true,
  },
];

describe('Line items functions', () => {
  it('calculateInitialLineItems', () => {
    expect(calculateInitialLineItems(prices, 'all')).toEqual([
      { price_id: 'price1', quantity: 1 },
      { price_id: 'price2', quantity: 2 },
      { price_id: 'price3', quantity: 3 },
      { price_id: 'price4', quantity: 4 },
    ]);
    expect(calculateInitialLineItems(prices, 'multiple')).toEqual([{ price_id: 'price1', quantity: 1 }]);
    expect(calculateInitialLineItems(prices, 'single')).toEqual([{ price_id: 'price1', quantity: 1 }]);
  });

  describe('getPerBundleQuantity', () => {
    it('divides the component total by the parent quantity', () => {
      // 2 bundles, component total 2 -> 1 per bundle.
      expect(getPerBundleQuantity({ quantity: 2 } as any, 2)).toBe(1);
      // 2 bundles, component total 4 -> 2 per bundle.
      expect(getPerBundleQuantity({ quantity: 4 } as any, 2)).toBe(2);
    });

    it('defaults the parent quantity to 1 and never returns below 1', () => {
      expect(getPerBundleQuantity({ quantity: 3 } as any)).toBe(3);
      expect(getPerBundleQuantity({ quantity: 0 } as any, 5)).toBe(1);
    });
  });

  describe('getBundleComponentRowsFromLineItems', () => {
    const components = [
      { id: 'c1', quantity: 4, variant_display_options: 'Red / XL', price: { product: { name: 'Air Beats' } } },
      { id: 'c2', quantity: 2, variant_display_options: '10°C', price: { product: { name: 'Sleeping Bag' } } },
      { id: 'c3', quantity: 2, variant_display_options: '', price: { product: { name: 'No Variant' } } },
    ];

    it('builds per-bundle rows and skips components without a variant', () => {
      const rows = getBundleComponentRowsFromLineItems(components as any, 2);
      expect(rows).toEqual([
        { id: 'c1', label: 'Air Beats - Red / XL', qty: 2 },
        { id: 'c2', label: 'Sleeping Bag - 10°C', qty: 1 },
      ]);
    });
  });

  describe('groupBundleLineItems', () => {
    it('orders bundle components by position, regardless of payload order', () => {
      const items = [
        {
          id: 'bundle',
          price: { product: { bundle: true } },
          component_line_items: {
            data: [
              { id: 'c-third', position: 2 },
              { id: 'c-first', position: 0 },
              { id: 'c-second', position: 1 },
            ],
          },
        },
      ];

      const { componentsByParent } = groupBundleLineItems(items as any);
      expect(componentsByParent.bundle.map(c => c.id)).toEqual(['c-first', 'c-second', 'c-third']);
    });

    it('preserves payload order when position is missing', () => {
      const items = [
        {
          id: 'bundle',
          price: { product: { bundle: true } },
          component_line_items: {
            data: [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
          },
        },
      ];

      const { componentsByParent } = groupBundleLineItems(items as any);
      expect(componentsByParent.bundle.map(c => c.id)).toEqual(['a', 'b', 'c']);
    });
  });

  describe('getSessionId', () => {
    it('Should be able to refresh', async () => {
      expect(getSessionId('asdf', { id: 'existing' }, true)).toBe(false);
    });

    it('Should return the checkout session id if it already exists', async () => {
      expect(getSessionId('asdf', { id: 'existing' })).toBe('existing');
    });

    it('Should get the checkout session from the url, first', async () => {
      delete window.location;
      window.location = new URL('https://www.example.com?order=urltest') as any;
      expect(getSessionId('asdf', {})).toBe('urltest');
    });

    it('Should get the checkout session from localstorage, second', async () => {
      jest.spyOn(window.localStorage.__proto__, 'getItem');
      window.localStorage.__proto__.getItem = jest.fn();
      getSessionId('asdf', {});
      expect(localStorage.getItem).toHaveBeenCalled();
    });
  });
});
