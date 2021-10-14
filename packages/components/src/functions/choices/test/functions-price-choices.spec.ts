import { getChoicePrices, getProductsFirstPriceId } from '../index';

const prices = {
  product1: {
    prices: {
      price1: {
        quantity: 1,
      },
      price2: {
        quantity: 2,
      },
    },
  },
  product2: {
    prices: {
      price3: {
        quantity: 3,
      },
      price4: {
        quantity: 4,
      },
    },
  },
};

describe('Price choice functions', () => {
  it('getChoicePrices', () => {
    expect(getChoicePrices(prices)).toEqual([
      { id: 'price1', quantity: 1 },
      { id: 'price2', quantity: 2 },
      { id: 'price3', quantity: 3 },
      { id: 'price4', quantity: 4 },
    ]);
  });
  it('getProductsFirstPriceId', () => {
    expect(getProductsFirstPriceId('product2', prices)).toEqual('price3');
  });
});
