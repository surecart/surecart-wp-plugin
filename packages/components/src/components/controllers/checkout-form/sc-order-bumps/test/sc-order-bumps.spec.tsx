// Mock the checkout store.
jest.mock('@store/checkouts/store', () => ({
  __esModule: true,
  default: {
    state: { live: {}, test: {} },
    set: jest.fn(),
    get: jest.fn(),
    onChange: jest.fn(),
    on: jest.fn(),
    dispose: jest.fn(),
  },
  state: { live: {}, test: {} },
  set: jest.fn(),
  get: jest.fn(),
  onChange: jest.fn(),
  on: jest.fn(),
  dispose: jest.fn(),
}));

import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { Bump, Checkout, LineItem, Product } from '../../../../../types';
import { dispose as disposeCheckout, state as checkoutState } from '@store/checkout';
import { ScOrderBumps } from '../sc-order-bumps';

describe('sc-order-bump', () => {
  beforeEach(() => {
    disposeCheckout();
  });

  it('renders empty if no bumps', async () => {
    const page = await newSpecPage({
      components: [ScOrderBumps],
      template: () => <sc-order-bumps></sc-order-bumps>,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders default label', async () => {
    checkoutState.checkout = {
      id: 'test',
      recommended_bumps: {
        data: [
          {
            name: 'Test',
            amount_off: 123,
            price: {
              amount: 123,
              currency: 'USD',
              product: {
                id: 'test',
                name: 'Test',
                description: 'Test',
                variants: {
                  pagination: {
                    count: 0,
                  },
                },
              } as Product,
            },
          },
        ] as Bump[],
      },
    } as Checkout;
    const page = await newSpecPage({
      components: [ScOrderBumps],
      template: () => <sc-order-bumps></sc-order-bumps>,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders custom label', async () => {
    checkoutState.checkout = {
      id: 'test',
      recommended_bumps: {
        data: [
          {
            name: 'Test',
            amount_off: 123,
            price: {
              amount: 123,
              currency: 'USD',
              product: {
                id: 'test',
                name: 'Test',
                description: 'Test',
                variants: {
                  pagination: {
                    count: 0,
                  },
                },
              } as Product,
            },
          },
        ] as Bump[],
      },
    } as Checkout;
    const page = await newSpecPage({
      components: [ScOrderBumps],
      template: () => <sc-order-bumps label="custom"></sc-order-bumps>,
    });
    expect(page.root).toMatchSnapshot();
  });

  const checkoutWithAddedBump = {
    id: 'test',
    line_items: {
      data: [{ id: 'line-item-id', bump: 'bump-id' } as LineItem],
    },
    recommended_bumps: {
      data: [
        {
          id: 'bump-id',
          name: 'Test',
          amount_off: 123,
          price: {
            amount: 123,
            currency: 'USD',
            product: {
              id: 'test',
              name: 'Test',
              description: 'Test',
              variants: {
                pagination: {
                  count: 0,
                },
              },
            } as Product,
          },
        },
      ] as Bump[],
    },
  } as Checkout;

  it('hides bumps already added to the checkout when hideAddedItems is set', async () => {
    checkoutState.checkout = checkoutWithAddedBump;
    const page = await newSpecPage({
      components: [ScOrderBumps],
      template: () => <sc-order-bumps hideAddedItems={true}></sc-order-bumps>,
    });
    expect(page.root.shadowRoot.querySelector('sc-order-bump')).toBeNull();
  });

  it('keeps added bumps visible when hideAddedItems is not set', async () => {
    checkoutState.checkout = checkoutWithAddedBump;
    const page = await newSpecPage({
      components: [ScOrderBumps],
      template: () => <sc-order-bumps></sc-order-bumps>,
    });
    expect(page.root.shadowRoot.querySelector('sc-order-bump')).not.toBeNull();
  });
});
