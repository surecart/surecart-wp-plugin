import { getMaxStockQuantity } from '../quantity';

const makeProduct = (overrides = {}) => ({
  id: 'prod_1',
  has_unlimited_stock: false,
  available_stock: 10,
  purchase_limit: null,
  ...overrides,
});

const makeVariant = (overrides = {}) => ({
  id: 'var_1',
  has_unlimited_stock: false,
  available_stock: 5,
  ...overrides,
});

describe('getMaxStockQuantity', () => {
  it('returns purchase_limit when set', () => {
    const product = makeProduct({ purchase_limit: 3 });
    expect(getMaxStockQuantity(product as any)).toBe(3);
  });

  it('returns null when product has unlimited stock', () => {
    const product = makeProduct({ has_unlimited_stock: true });
    expect(getMaxStockQuantity(product as any)).toBeNull();
  });

  it('returns product available_stock when stock is tracked and no variant', () => {
    const product = makeProduct({ available_stock: 7 });
    expect(getMaxStockQuantity(product as any)).toBe(7);
  });

  it('returns null when variant has unlimited stock', () => {
    const product = makeProduct({ has_unlimited_stock: false });
    const variant = makeVariant({ has_unlimited_stock: true });
    expect(getMaxStockQuantity(product as any, variant as any)).toBeNull();
  });

  it('returns variant available_stock when variant stock is tracked', () => {
    const product = makeProduct({ has_unlimited_stock: false, available_stock: 10 });
    const variant = makeVariant({ has_unlimited_stock: false, available_stock: 3 });
    expect(getMaxStockQuantity(product as any, variant as any)).toBe(3);
  });

  it('returns null when variant inherits unlimited from product', () => {
    const product = makeProduct({ has_unlimited_stock: true });
    const variant = makeVariant({ has_unlimited_stock: null, available_stock: 0 });
    expect(getMaxStockQuantity(product as any, variant as any)).toBeNull();
  });

  it('returns variant stock when variant inherits tracked from product', () => {
    const product = makeProduct({ has_unlimited_stock: false, available_stock: 10 });
    const variant = makeVariant({ has_unlimited_stock: null, available_stock: 2 });
    expect(getMaxStockQuantity(product as any, variant as any)).toBe(2);
  });
});
