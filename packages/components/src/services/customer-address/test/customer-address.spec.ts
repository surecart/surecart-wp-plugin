import { Address } from 'src/types';
import { hasAddressData, isAddressEmpty } from '../index';

describe('hasAddressData', () => {
  it('is true for a populated address', () => {
    expect(hasAddressData({ line_1: 'Rua da Floresta', city: 'Goiania', country: 'BR' })).toBe(true);
  });

  it('is true when only a country is saved (country-only shipping address)', () => {
    // Regression: a customer whose shipping address has only a country must still autofill,
    // so the checkout shows that country instead of an empty field.
    expect(hasAddressData({ country: 'BR', line_1: null, line_2: null, city: null, state: null, postal_code: null, name: null } as Partial<Address>)).toBe(true);
  });

  it('is false for a fully empty address', () => {
    expect(hasAddressData({ country: null, line_1: null, city: null, state: null, postal_code: null, name: null } as Partial<Address>)).toBe(false);
  });

  it('is false for the API "none" array', () => {
    expect(hasAddressData([])).toBe(false);
  });

  it('is false for null/undefined', () => {
    expect(hasAddressData(null)).toBe(false);
    expect(hasAddressData(undefined)).toBe(false);
  });
});

describe('isAddressEmpty', () => {
  it('ignores country when deciding emptiness (IP-detected, must not block autofill)', () => {
    expect(isAddressEmpty({ country: 'BR' })).toBe(true);
  });

  it('is false once a content field is set', () => {
    expect(isAddressEmpty({ country: 'BR', city: 'Goiania' })).toBe(false);
  });

  it('is true for null/undefined', () => {
    expect(isAddressEmpty(null)).toBe(true);
    expect(isAddressEmpty(undefined)).toBe(true);
  });
});
