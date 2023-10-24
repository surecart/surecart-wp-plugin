import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { Bump, Checkout } from '../../../../../types';
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
        data: [{ name: 'Test', amount_off: 123 }] as Bump[],
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
        data: [{ name: 'Test', amount_off: 123 }] as Bump[],
      },
    } as Checkout;
    const page = await newSpecPage({
      components: [ScOrderBumps],
      template: () => <sc-order-bumps label="custom"></sc-order-bumps>,
    });
    expect(page.root).toMatchSnapshot();
  });
});
