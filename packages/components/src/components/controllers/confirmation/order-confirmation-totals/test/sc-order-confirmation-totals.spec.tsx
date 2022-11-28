import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { ScOrderConfirmationTotals } from '../sc-order-confirmation-totals';
import { Checkout, Order } from '../../../../../types';

describe('sc-order-confirmation-totals', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScOrderConfirmationTotals],
      html: `<sc-order-confirmation-totals></sc-order-confirmation-totals>`,
    });
    expect(page.root).toMatchSnapshot();
  });
  it('renders bump amount', async () => {
    const page = await newSpecPage({
      components: [ScOrderConfirmationTotals],
      template: () => <sc-order-confirmation-totals order={{ bump_amount: -100 } as Checkout}></sc-order-confirmation-totals>,
    });
    expect(page.root).toMatchSnapshot();
  });
});
