import { newSpecPage } from '@stencil/core/testing';
import { ScOrderConfirmationTotals } from '../sc-order-confirmation-totals';

describe('sc-order-confirmation-totals', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScOrderConfirmationTotals],
      html: `<sc-order-confirmation-totals></sc-order-confirmation-totals>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
