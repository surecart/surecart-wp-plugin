import { newSpecPage } from '@stencil/core/testing';
import { CeOrderConfirmationTotals } from '../ce-order-confirmation-totals';

describe('ce-order-confirmation-totals', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeOrderConfirmationTotals],
      html: `<ce-order-confirmation-totals></ce-order-confirmation-totals>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
