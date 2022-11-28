import { newSpecPage } from '@stencil/core/testing';
import { ScOrderSummary } from '../sc-order-summary';
import { h } from '@stencil/core';
import { Checkout } from '../../../../../types';

describe('sc-order-summary', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScOrderSummary],
      html: `<sc-order-summary></sc-order-summary>`,
    });
    expect(page.root).toMatchSnapshot();
  });
  it('renders scratch price if different from amount and collapsed', async () => {
    const page = await newSpecPage({
      components: [ScOrderSummary],
      template: () => <sc-order-summary order={{scratch_amount: 2000, total_amount: 1000} as any} collapsible collapsed></sc-order-summary>
    });
    expect(page.root).toMatchSnapshot();
  });
  it('does not render scratch price if the same as amount and collapsed', async () => {
    const page = await newSpecPage({
      components: [ScOrderSummary],
      template: () => <sc-order-summary order={{scratch_amount: 1000, total_amount: 1000} as any} collapsible collapsed></sc-order-summary>
    });
    expect(page.root).toMatchSnapshot();
  });
});
