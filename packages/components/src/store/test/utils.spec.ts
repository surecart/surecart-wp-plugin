import { isProductVariantOptionSoldOut } from '../utils';

const makeProduct = (overrides = {}) => ({
  id: 'prod_1',
  has_unlimited_stock: false,
  available_stock: 10,
  variants: { data: [] },
  ...overrides,
});

const makeVariant = (overrides = {}) => ({
  id: 'var_1',
  option_1: 'Small',
  option_2: null,
  option_3: null,
  has_unlimited_stock: false,
  available_stock: 5,
  ...overrides,
});

describe('isProductVariantOptionSoldOut', () => {
  it('returns false when variant has stock', () => {
    const product = makeProduct({
      variants: {
        data: [makeVariant({ option_1: 'Small', available_stock: 5 })],
      },
    });
    expect(isProductVariantOptionSoldOut(1, 'Small', {}, product)).toBe(false);
  });

  it('returns true when all matching variants have zero stock', () => {
    const product = makeProduct({
      variants: {
        data: [
          makeVariant({ option_1: 'Small', available_stock: 0 }),
          makeVariant({ id: 'var_2', option_1: 'Small', available_stock: 0 }),
        ],
      },
    });
    expect(isProductVariantOptionSoldOut(1, 'Small', {}, product)).toBe(true);
  });

  it('returns false when no variants match the option', () => {
    const product = makeProduct({
      variants: {
        data: [makeVariant({ option_1: 'Large', available_stock: 0 })],
      },
    });
    expect(isProductVariantOptionSoldOut(1, 'Small', {}, product)).toBe(false);
  });

  it('returns false when variant has unlimited stock even with zero available', () => {
    const product = makeProduct({
      variants: {
        data: [
          makeVariant({ option_1: 'Small', has_unlimited_stock: true, available_stock: 0 }),
        ],
      },
    });
    expect(isProductVariantOptionSoldOut(1, 'Small', {}, product)).toBe(false);
  });

  it('returns false when variant inherits unlimited from product', () => {
    const product = makeProduct({
      has_unlimited_stock: true,
      variants: {
        data: [
          makeVariant({ option_1: 'Small', has_unlimited_stock: null, available_stock: 0 }),
        ],
      },
    });
    expect(isProductVariantOptionSoldOut(1, 'Small', {}, product)).toBe(false);
  });

  it('returns true when variant inherits tracked stock from product and is sold out', () => {
    const product = makeProduct({
      has_unlimited_stock: false,
      variants: {
        data: [
          makeVariant({ option_1: 'Small', has_unlimited_stock: null, available_stock: 0 }),
        ],
      },
    });
    expect(isProductVariantOptionSoldOut(1, 'Small', {}, product)).toBe(true);
  });

  it('handles option 2 filtering correctly', () => {
    const product = makeProduct({
      variants: {
        data: [
          makeVariant({ option_1: 'Small', option_2: 'Red', available_stock: 0 }),
          makeVariant({ id: 'var_2', option_1: 'Small', option_2: 'Blue', available_stock: 5 }),
        ],
      },
    });
    expect(isProductVariantOptionSoldOut(2, 'Red', { option_1: 'Small' }, product)).toBe(true);
    expect(isProductVariantOptionSoldOut(2, 'Blue', { option_1: 'Small' }, product)).toBe(false);
  });

  it('handles option 3 filtering correctly', () => {
    const product = makeProduct({
      variants: {
        data: [
          makeVariant({ option_1: 'Small', option_2: 'Red', option_3: 'Cotton', available_stock: 0 }),
          makeVariant({ id: 'var_2', option_1: 'Small', option_2: 'Red', option_3: 'Silk', available_stock: 3 }),
        ],
      },
    });
    expect(isProductVariantOptionSoldOut(3, 'Cotton', { option_1: 'Small', option_2: 'Red' }, product)).toBe(true);
    expect(isProductVariantOptionSoldOut(3, 'Silk', { option_1: 'Small', option_2: 'Red' }, product)).toBe(false);
  });
});
