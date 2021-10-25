import { PriceChoice } from '../../../types';
import { getChoicePrices, getAvailablePricesForProduct } from '../index';

const prices = [
  {
    id: 'price_1',
    product_id: 'product_1',
    quantity: 1,
    enabled: true,
  },
  {
    id: 'price_2',
    product_id: 'product_2',
    quantity: 2,
    enabled: true,
  },
  {
    id: 'price_3',
    product_id: 'product_3',
    quantity: 2,
    enabled: false,
  },
] as Array<PriceChoice>;

describe('Price choice functions', () => {
  describe('getChoicePrices', () => {
    it('outputs all the prices', () => {
      expect(getChoicePrices(prices)).toEqual([
        { id: 'price_1', quantity: 1, product_id: 'product_1', enabled: true },
        { id: 'price_2', quantity: 2, product_id: 'product_2', enabled: true },
      ]);
    });
  });
  // describe('getProductChoicePriceIdByIndex', () => {
  //   it('Gets the first price id', () => {
  //     expect(getProductChoicePriceIdByIndex('product2', prices, 0)).toEqual('price3');
  //   });
  //   it('Gets the second price id', () => {
  //     expect(getProductChoicePriceIdByIndex('product2', prices, 1)).toEqual('price4');
  //   });
  // });
  // describe('getProductChoicePriceByIndex', () => {
  //   it('Gets the first price', () => {
  //     expect(getProductChoicePriceByIndex('product2', prices, 0)).toEqual({ id: 'price3', quantity: 3, enabled: true });
  //   });
  //   it('Gets the second price', () => {
  //     expect(getProductChoicePriceByIndex('product2', prices, 1)).toEqual({ id: 'price4', quantity: 4, enabled: true });
  //   });
  // });
  describe('getAvailablePricesForProduct', () => {
    it('does not return archived prices', () => {
      expect(
        getAvailablePricesForProduct(
          {
            id: 'product1',
            prices: [
              { id: 'price2', amount: 2000, archived: true },
              { id: 'price3', amount: 2000 },
              { id: 'price4', amount: 2000 },
            ],
          },
          {
            product1: {
              prices: {
                price2: {
                  quantity: 1,
                  enabled: true,
                },
                price3: {
                  quantity: 1,
                  enabled: true,
                },
                price4: {
                  quantity: 1,
                  enabled: true,
                },
              },
            },
          },
        ),
      ).toEqual([
        { id: 'price3', amount: 2000 },
        { id: 'price4', amount: 2000 },
      ]);
    });
    it('does not return non-enabled prices', () => {
      expect(
        getAvailablePricesForProduct(
          {
            id: 'product1',
            prices: [
              { id: 'price2', amount: 2000 },
              { id: 'price3', amount: 2000 },
              { id: 'price4', amount: 2000 },
            ],
          },
          {
            product1: {
              prices: {
                price2: {
                  quantity: 1,
                  enabled: true,
                },
                price3: {
                  quantity: 1,
                  enabled: false,
                },
                price4: {
                  quantity: 1,
                  enabled: true,
                },
              },
            },
          },
        ),
      ).toEqual([
        { id: 'price2', amount: 2000 },
        { id: 'price4', amount: 2000 },
      ]);
    });
  });
});
