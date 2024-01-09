import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { ScUpsell } from '../sc-upsell';
import { state, dispose } from '@store/upsell';
import { Checkout, ManualPaymentMethod } from 'src/types';

describe('sc-upsell', () => {
  beforeEach(() => {
    dispose();
  });

  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScUpsell],
      template: () => <sc-upsell></sc-upsell>,
    });
    expect(page.root).toMatchSnapshot();
    page.rootInstance.disconnectedCallback();
  });

  it('renders with manual payment method', async () => {
    state.checkout = {
      manual_payment_method: {
        name: 'Manual Payment Method',
        instructions: 'Manual Payment Method Instructions',
      } as ManualPaymentMethod,
    } as Checkout;

    const page = await newSpecPage({
      components: [ScUpsell],
      template: () => <sc-upsell></sc-upsell>,
    });
    expect(page.root).toMatchSnapshot();
    page.rootInstance.disconnectedCallback();
  });
});
