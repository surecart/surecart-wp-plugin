import { calculateInitialLineItems, getLineItemPriceIds } from '../index';

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

const lineItems = [
  {
    price: {
      id: 'price1',
    },
  },
  {
    price: {
      id: 'price2',
    },
  },
];

describe('Line items functions', () => {
  it('calculateInitialLineItems', () => {
    expect(calculateInitialLineItems(prices, 'all')).toEqual([
      { id: 'price1', quantity: 1 },
      { id: 'price2', quantity: 2 },
      { id: 'price3', quantity: 3 },
      { id: 'price4', quantity: 4 },
    ]);
    expect(calculateInitialLineItems(prices, 'multiple')).toEqual([{ id: 'price1', quantity: 1 }]);
    expect(calculateInitialLineItems(prices, 'single')).toEqual([{ id: 'price1', quantity: 1 }]);
  });

  it('getLineItemPriceIds', () => {
    expect(getLineItemPriceIds(lineItems)).toEqual(['price1', 'price2']);
  });
});
