import { newSpecPage } from '@stencil/core/testing';
import { ScOrderSummary } from '../sc-order-summary';
import { h } from '@stencil/core';
import { state as checkoutStore, dispose } from '@store/checkout';

describe('sc-order-summary', () => {
  beforeEach(() => {
    dispose();
  });
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScOrderSummary],
      html: `<sc-order-summary></sc-order-summary>`,
    });
    expect(page.root).toMatchSnapshot();
  });
  it('renders scratch price if no trial has total savings amount', async () => {
    checkoutStore.checkout = { amount_due: 1000, total_amount: 1000, total_savings_amount: -100 } as any;
    const page = await newSpecPage({
      components: [ScOrderSummary],
      template: () => <sc-order-summary collapsible collapsed></sc-order-summary>,
    });
    expect(page.root).toMatchSnapshot();
  });
  it('does not render scratch price amount_due is different than total_amount', async () => {
    const page = await newSpecPage({
      components: [ScOrderSummary],
      template: () => <sc-order-summary order={{ scratch_amount: 1000, total_amount: 2000, total_savings_amount: -100 } as any} collapsible collapsed></sc-order-summary>,
    });
    expect(page.root).toMatchSnapshot();
  });
});
